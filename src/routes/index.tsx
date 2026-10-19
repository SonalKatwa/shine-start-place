import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/utils/supabase";
import logoAsset from "@/assets/mylogo.jpg";
import productBracelet from "@/assets/bracelet_aura.png";
import productNecklace from "@/assets/necklace_at_high.png";
import productCharm from "@/assets/phonecharm_hellokitty.png";
import productBookmark from "@/assets/bookcharm_bouquet.png";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { data: todos, error } = await supabase.from("todos").select();
    return { todos, todosError: error?.message ?? null };
  },
  component: Home,
});

function Home() {
  const { todos, todosError } = Route.useLoaderData();
  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative z-10">
            <span className="chip">Handmade · Small batch</span>
            <h1 className="mt-5 text-5xl md:text-7xl leading-[0.95]">
              Tiny things,
              <br />
              <em className="font-script not-italic text-primary text-6xl md:text-8xl">
                big feelings.
              </em>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              A cute, vintage-magazine jewelry corner — silver charms, bows, pearls and phone
              friends, all handmade with a lot of blush.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm hover:opacity-90 transition"
              >
                Explore the drop →
              </Link>
              <a
                href="#collections"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm hover:bg-muted transition"
              >
                Browse categories
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div>
                <div className="text-2xl font-display text-foreground">{products.length}+</div>tiny
                pieces
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-display text-foreground">{categories.length}</div>
                collections
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-display text-foreground">100%</div>handmade
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-6 bg-secondary/60 blur-3xl rounded-[3rem]"
              aria-hidden
            />
            <div className="relative paper-card p-4 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src={logoAsset}
                alt="MochaBlush.Co collage"
                className="w-full aspect-square object-cover rounded-2xl"
              />
              <div
                className="absolute -top-4 -left-4 chip animate-float"
                style={{ ["--r" as string]: "-6deg" }}
              >
                New drop 🎀
              </div>
              <div
                className="absolute -bottom-5 -right-3 chip animate-float bg-accent/60"
                style={{ ["--r" as string]: "4deg" }}
              >
                Made with love ✿
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="chip">Shop by mood</span>
            <h2 className="mt-3 text-4xl md:text-5xl">The collections</h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline text-sm text-muted-foreground hover:text-foreground"
          >
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group paper-card p-5 md:p-7 aspect-[4/5] flex flex-col justify-between hover:-translate-y-1 transition"
              style={{
                background:
                  i % 3 === 0
                    ? "color-mix(in oklab, white 82%, var(--blush) 18%)"
                    : i % 3 === 1
                      ? "color-mix(in oklab, white 82%, var(--sky-soft) 18%)"
                      : "color-mix(in oklab, white 82%, var(--lilac) 18%)",
              }}
            >
              <div className="text-xs tracking-widest uppercase text-muted-foreground">
                0{i + 1}
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl">{c.name}</div>
                <div className="mt-2 text-sm text-muted-foreground">{c.tag}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-foreground group-hover:gap-2 transition-all">
                  Shop <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="shop" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="chip">This week's darlings</span>
          <h2 className="mt-3 text-4xl md:text-5xl">Freshly strung ✿</h2>
          <p className="mt-3 text-muted-foreground">
            Tiny batches, tinier charms. Once they're gone, they're gone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex rounded-full border border-border bg-card px-6 py-3 text-sm hover:bg-muted transition"
          >
            See all {products.length} pieces →
          </Link>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="paper-card p-8 md:p-14 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3">
            <span className="chip">Our story</span>
            <h2 className="mt-3 text-4xl md:text-5xl">
              A little pink corner of the internet, made by hand.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl">
              MochaBlush.Co is a one-person studio for cute silver jewelry, phone charms and paper
              things — inspired by strawberry milk, denim stars and old magazine clippings. Every
              piece is threaded, knotted and packed by us.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">925 silver</span>
              <span className="chip">Freshwater pearls</span>
              <span className="chip">Ships worldwide</span>
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <img
              src={productBracelet}
              alt=""
              loading="lazy"
              className="rounded-2xl aspect-square object-cover -rotate-3"
            />
            <img
              src={productCharm}
              alt=""
              loading="lazy"
              className="rounded-2xl aspect-square object-cover mt-8 rotate-3"
            />
            <img
              src={productBookmark}
              alt=""
              loading="lazy"
              className="rounded-2xl aspect-square object-cover rotate-2"
            />
            <img
              src={productNecklace}
              alt=""
              loading="lazy"
              className="rounded-2xl aspect-square object-cover -mt-6 -rotate-2"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="mx-auto max-w-4xl px-5 py-16 md:py-24 text-center">
        <span className="chip">Stay in the loop</span>
        <h2 className="mt-3 text-4xl md:text-5xl">Be first to know when we restock ♡</h2>
        <p className="mt-3 text-muted-foreground">
          Little notes, drop dates and Insta-exclusive codes.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:opacity-90 transition">
            Subscribe
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-3xl md:text-4xl">Todos</h2>
        {todosError ? (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            Unable to load todos: {todosError}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {todos?.map((todo) => (
              <li key={todo.id}>{todo.name}</li>
            ))}
          </ul>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
