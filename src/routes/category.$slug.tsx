import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory, productsByCategory } from "@/lib/products";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const c = getCategory(params.slug);
    if (!c) throw notFound();
    return { category: c };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — MochaBlush.Co` },
          { name: "description", content: loaderData.category.blurb },
        ]
      : [{ title: "Not found" }, { name: "robots", content: "noindex" }],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-4xl">Collection not found</h1>
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

function CategoryPage() {
  const { slug } = Route.useParams();
  const { category } = Route.useLoaderData();
  const items = productsByCategory(slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        <span className="chip mt-4">{category.tag}</span>
        <h1 className="mt-3 text-4xl md:text-6xl font-script text-primary">{category.name}</h1>
        <p className="mt-3 text-muted-foreground max-w-lg">{category.blurb}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== slug)
            .map((c) => (
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
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
