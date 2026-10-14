import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { formatPrice, getProduct } from "@/lib/products";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your cart — MochaBlush.Co" }, { name: "robots", content: "noindex" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove } = useCart();
  const rows = items.map((i) => ({ ...i, product: getProduct(i.id)! })).filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 pt-12 pb-16">
        <span className="chip">Your bag</span>
        <h1 className="mt-3 text-4xl md:text-5xl">Cart</h1>

        {rows.length === 0 ? (
          <div className="mt-10 paper-card p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <ul className="md:col-span-2 space-y-4">
              {rows.map((r) => (
                <li key={r.id} className="paper-card p-4 flex gap-4 items-center">
                  <Link to="/product/$id" params={{ id: r.id }} className="shrink-0">
                    <img
                      src={r.product.img}
                      alt={r.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/product/$id"
                      params={{ id: r.id }}
                      className="font-display text-lg hover:text-primary"
                    >
                      {r.product.name}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(r.product.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border border-border rounded-full px-1">
                    <button
                      onClick={() => setQty(r.id, r.qty - 1)}
                      className="p-1.5 hover:text-primary"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{r.qty}</span>
                    <button
                      onClick={() => setQty(r.id, r.qty + 1)}
                      className="p-1.5 hover:text-primary"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="hidden sm:block w-20 text-right font-display">
                    {formatPrice(r.product.price * r.qty)}
                  </div>
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="paper-card p-6 h-fit">
              <h2 className="font-display text-2xl">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-display text-lg">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 w-full inline-flex justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm hover:opacity-90 transition"
              >
                Checkout →
              </Link>
              <Link
                to="/shop"
                className="mt-3 w-full inline-flex justify-center text-xs text-muted-foreground hover:text-foreground"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
