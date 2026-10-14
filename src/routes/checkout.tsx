import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { formatPrice, getProduct } from "@/lib/products";
import { useAuth, useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — MochaBlush.Co" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

type Method = "upi" | "razorpay" | "cod";

function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const rows = items.map((i) => ({ ...i, product: getProduct(i.id)! })).filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 60;
  const total = subtotal + shipping;

  const [method, setMethod] = useState<Method>("upi");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);

  if (rows.length === 0 && !placed) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="text-4xl">Nothing to checkout</h1>
          <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm"
          >
            Browse the shop
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <div className="text-5xl">✿</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-script text-primary">Order placed!</h1>
          <p className="mt-3 text-muted-foreground">
            Order ref <span className="font-mono">{placed}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            You'll get a confirmation at your email. (Payment gateway is a placeholder — no real
            charge.)
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/" className="rounded-full bg-foreground text-background px-6 py-3 text-sm">
              Back home
            </Link>
            <Link
              to="/shop"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm"
            >
              Keep shopping
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  async function place(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    // Placeholder for real Razorpay / UPI integration
    await new Promise((r) => setTimeout(r, 900));
    const ref = "MB" + Math.random().toString(36).slice(2, 8).toUpperCase();
    clear();
    setPlaced(ref);
    setPlacing(false);
    toast.success("Order placed ♡");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 pt-12 pb-16">
        <span className="chip">Almost yours</span>
        <h1 className="mt-3 text-4xl md:text-5xl">Checkout</h1>

        <form onSubmit={place} className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="paper-card p-6">
              <h2 className="font-display text-2xl">Contact</h2>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <Input label="Full name" required defaultValue={user?.name} />
                <Input label="Email" type="email" required defaultValue={user?.email} />
                <Input label="Phone" required pattern="[0-9+ -]{7,}" placeholder="+91 …" />
              </div>
            </div>

            <div className="paper-card p-6">
              <h2 className="font-display text-2xl">Shipping address</h2>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <Input label="Address line 1" required className="sm:col-span-2" />
                <Input label="City" required />
                <Input label="State" required />
                <Input label="PIN code" required pattern="[0-9]{4,6}" />
                <Input label="Country" required defaultValue="India" />
              </div>
            </div>

            <div className="paper-card p-6">
              <h2 className="font-display text-2xl">Payment</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Payment gateway coming soon — Razorpay / UPI will be wired up. For now this is a
                demo checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <PayOption
                  id="upi"
                  method={method}
                  setMethod={setMethod}
                  title="UPI"
                  hint="Pay via any UPI app"
                />
                <PayOption
                  id="razorpay"
                  method={method}
                  setMethod={setMethod}
                  title="Razorpay (cards / netbanking)"
                  hint="Coming soon"
                />
                <PayOption
                  id="cod"
                  method={method}
                  setMethod={setMethod}
                  title="Cash on delivery"
                  hint="India only, +₹ 30"
                />
              </div>
              {method === "upi" && (
                <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm">
                  <div className="text-muted-foreground text-xs uppercase tracking-widest">
                    Send to
                  </div>
                  <div className="font-mono mt-1">mochablush@upi</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    You'll be asked to share the payment screenshot after placing the order.
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="paper-card p-6 h-fit">
            <h2 className="font-display text-2xl">Your order</h2>
            <ul className="mt-4 space-y-3 max-h-72 overflow-auto pr-1">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 text-sm">
                  <img src={r.product.img} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{r.product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {r.qty}</div>
                  </div>
                  <div>{formatPrice(r.product.price * r.qty)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-sm border-t border-border pt-4">
              <Row k="Subtotal" v={formatPrice(subtotal)} />
              <Row k="Shipping" v={shipping === 0 ? "Free" : formatPrice(shipping)} />
              {method === "cod" && <Row k="COD fee" v={formatPrice(30)} />}
              <div className="flex justify-between font-display text-lg pt-2 border-t border-border">
                <dt>Total</dt>
                <dd>{formatPrice(total + (method === "cod" ? 30 : 0))}</dd>
              </div>
            </dl>
            <button
              disabled={placing}
              className="mt-6 w-full rounded-full bg-foreground text-background px-6 py-3 text-sm hover:opacity-90 transition disabled:opacity-60"
            >
              {placing
                ? "Placing…"
                : `Place order · ${formatPrice(total + (method === "cod" ? 30 : 0))}`}
            </button>
            <Link
              to="/cart"
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Back to cart
            </Link>
          </aside>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function Input({
  label,
  className = "",
  ...rest
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={"block " + className}>
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </span>
      <input
        {...rest}
        className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function PayOption({
  id,
  method,
  setMethod,
  title,
  hint,
}: {
  id: Method;
  method: Method;
  setMethod: (m: Method) => void;
  title: string;
  hint: string;
}) {
  const active = method === id;
  return (
    <label
      className={
        "flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition " +
        (active ? "border-primary bg-secondary/40" : "border-border hover:bg-muted")
      }
    >
      <input
        type="radio"
        name="pay"
        checked={active}
        onChange={() => setMethod(id)}
        className="mt-1 accent-primary"
      />
      <div>
        <div className="font-display text-lg leading-tight">{title}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
    </label>
  );
}
