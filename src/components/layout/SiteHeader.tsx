import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, User } from "lucide-react";
import logoAsset from "@/assets/mylogo.jpg";
import { useAuth, useCart, useWishlist } from "@/lib/store";
import { categories } from "@/lib/products";

export function SiteHeader() {
  const { count } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <nav className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logoAsset}
            alt="MochaBlush.Co"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
          />
          <span className="font-script text-2xl leading-none hidden sm:block">
            MochaBlush<span className="text-primary">.Co</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
          <li>
            <Link
              to="/shop"
              className="hover:text-foreground transition"
              activeProps={{ className: "text-foreground" }}
            >
              Shop
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className="hover:text-foreground transition"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative p-2 rounded-full hover:bg-muted transition"
          >
            <Heart className="h-5 w-5" />
            {ids.length > 0 && <Badge>{ids.length}</Badge>}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative p-2 rounded-full hover:bg-muted transition"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <Badge>{count}</Badge>}
          </Link>
          <Link
            to="/login"
            aria-label="Account"
            className="p-2 rounded-full hover:bg-muted transition"
            title={user ? user.name : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] leading-none rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
      {children}
    </span>
  );
}
