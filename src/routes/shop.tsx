import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — MochaBlush.Co" },
      {
        name: "description",
        content:
          "Browse handmade bracelets, necklaces, bookmarks, phone charms, keychains, earrings and bag charms.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-6">
        <span className="chip">Shop all</span>
        <h1 className="mt-3 text-4xl md:text-5xl">Every little thing ✿</h1>
        <p className="mt-3 text-muted-foreground max-w-lg">
          {products.length} handmade pieces across {categories.length} collections.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="chip hover:bg-primary hover:text-primary-foreground transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
