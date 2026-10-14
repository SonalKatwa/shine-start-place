import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, getCategory, getProduct, productsByCategory } from "@/lib/products";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — MochaBlush.Co` },
          { name: "description", content: loaderData.product.desc },
        ]
      : [{ title: "Not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block chip">
          Back to shop
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-4xl">Something went wrong</h1>
      </div>
      <SiteFooter />
    </div>
  ),
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const cat = getCategory(p.category)!;
  const related = productsByCategory(p.category)
    .filter((x) => x.id !== p.id)
    .slice(0, 4);
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const liked = has(p.id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-16">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <Link to="/category/$slug" params={{ slug: cat.slug }} className="hover:text-foreground">
            {cat.name}
          </Link>
          <span>/</span>
          <span>{p.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="paper-card p-4 rotate-1">
            <img
              src={p.img}
              alt={p.name}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          </div>
          <div>
            <span className="chip">{cat.name}</span>
            <h1 className="mt-3 text-4xl md:text-5xl">{p.name}</h1>
            <div className="mt-3 text-2xl font-display text-primary">{formatPrice(p.price)}</div>
            <p className="mt-5 text-muted-foreground max-w-md">{p.desc}</p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  add(p.id);
                  toast.success("Added to cart");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm hover:opacity-90 transition"
              >
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>
              <button
                onClick={() => {
                  toggle(p.id);
                  toast(liked ? "Removed from wishlist" : "Saved to wishlist ♡");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm hover:bg-muted transition"
              >
                <Heart className={"h-4 w-4 " + (liked ? "fill-primary text-primary" : "")} />
                {liked ? "Saved" : "Save"}
              </button>
            </div>

            <ul className="mt-8 text-sm text-muted-foreground space-y-1">
              <li>· Handmade small-batch</li>
              <li>· Ships in 3–5 days</li>
              <li>· Packed with a little note</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
