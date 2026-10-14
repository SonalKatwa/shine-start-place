import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { getProduct } from "@/lib/products";
import { useWishlist } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Your wishlist — MochaBlush.Co" }, { name: "robots", content: "noindex" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const items = ids.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-16">
        <span className="chip">Saved for later</span>
        <h1 className="mt-3 text-4xl md:text-5xl">Wishlist ♡</h1>

        {items.length === 0 ? (
          <div className="mt-10 paper-card p-10 text-center">
            <p className="text-muted-foreground">
              No saved pieces yet — tap the heart on anything you love.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm"
            >
              Find something sweet
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
