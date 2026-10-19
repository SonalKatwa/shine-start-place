import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabase } from "@/utils/supabase";

/* ---------- helpers ---------- */
const isBrowser = typeof window !== "undefined";
function useLocal<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    if (!isBrowser) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {
      // Ignore malformed persisted state and fall back to the default value.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      // Ignore storage quota or browser privacy errors and keep the in-memory value.
    }
  }, [key, v]);
  return [v, setV] as const;
}

/* ---------- Cart ---------- */
export type CartItem = { id: string; qty: number };
type CartCtx = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
};
const CartContext = createContext<CartCtx | null>(null);

/* ---------- Wishlist ---------- */
type WishCtx = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};
const WishContext = createContext<WishCtx | null>(null);

/* ---------- Auth ---------- */
export type User = { email: string; name: string };
type AuthCtx = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthCtx | null>(null);

function toAppUser(user: SupabaseUser | null): User | null {
  if (!user?.email) return null;
  const metadataName = user.user_metadata?.name;
  return {
    email: user.email,
    name:
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName
        : user.email.split("@")[0],
  };
}

export function StoreProviders({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocal<CartItem[]>("mb.cart", []);
  const [ids, setIds] = useLocal<string[]>("mb.wish", []);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof getSupabase>;
    try {
      supabase = getSupabase();
    } catch (error) {
      console.error("Unable to initialize Supabase auth:", error);
      setAuthReady(true);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(toAppUser(session?.user ?? null));
      setAuthReady(true);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Unable to restore the Supabase session:", error);
        setUser(toAppUser(data.session?.user ?? null));
        setAuthReady(true);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Unable to restore the Supabase session:", error);
        setAuthReady(true);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const cart: CartCtx = {
    items,
    add: (id, qty = 1) =>
      setItems((prev) => {
        const ex = prev.find((i) => i.id === id);
        return ex
          ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
          : [...prev, { id, qty }];
      }),
    remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    setQty: (id, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
      ),
    clear: () => setItems([]),
    count: items.reduce((s, i) => s + i.qty, 0),
  };

  const wish: WishCtx = {
    ids,
    toggle: (id) =>
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    has: (id) => ids.includes(id),
    clear: () => setIds([]),
  };

  const auth: AuthCtx = {
    user,
    ready: authReady,
    login: async (email, password) => {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signup: async (name, email, password) => {
      const { data, error } = await getSupabase().auth.signUp({
        email,
        password,
        options: { data: { name: name.trim() } },
      });
      if (error) throw error;
      return !data.session;
    },
    logout: async () => {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
    },
  };

  return (
    <AuthContext.Provider value={auth}>
      <WishContext.Provider value={wish}>
        <CartContext.Provider value={cart}>{children}</CartContext.Provider>
      </WishContext.Provider>
    </AuthContext.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be inside StoreProviders");
  return c;
};
export const useWishlist = () => {
  const c = useContext(WishContext);
  if (!c) throw new Error("useWishlist must be inside StoreProviders");
  return c;
};
export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be inside StoreProviders");
  return c;
};
