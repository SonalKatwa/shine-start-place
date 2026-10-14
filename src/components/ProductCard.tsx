import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const liked = has(p.id);

  return (
    <article className="paper-card overflow-hidden group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to="/product/$id" params={{ id: p.id }} className="block h-full w-full">
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggle(p.id);
            toast(liked ? "Removed from wishlist" : "Saved to wishlist ♡");
          }}
          className="absolute top-2 right-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition"
        >
          <Heart
            className={"h-4 w-4 " + (liked ? "fill-primary text-primary" : "text-foreground")}
          />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Link to="/product/$id" params={{ id: p.id }}>
          <h3 className="font-display text-xl leading-tight hover:text-primary transition">
            {p.name}
          </h3>
        </Link>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{formatPrice(p.price)}</span>
          <button
            onClick={() => {
              add(p.id);
              toast.success("Added to cart");
            }}
            className="text-xs uppercase tracking-widest text-primary hover:text-foreground transition"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
