import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logoAsset from "@/assets/mylogo.jpg";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — MochaBlush.Co" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, ready, login, signup, logout } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <p className="text-sm text-muted-foreground">Loading your account…</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="paper-card p-10 max-w-sm w-full text-center">
          <img src={logoAsset} alt="" className="h-14 w-14 rounded-full mx-auto object-cover" />
          <h1 className="mt-4 text-3xl font-script text-primary">hi, {user.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/wishlist"
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm"
            >
              Your wishlist
            </Link>
            <Link
              to="/cart"
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm"
            >
              Your cart
            </Link>
            <button
              onClick={async () => {
                try {
                  await logout();
                  toast("Signed out");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Unable to sign out");
                }
              }}
              className="text-xs text-muted-foreground hover:text-foreground mt-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, pw);
      } else {
        const confirmationRequired = await signup(name, email, pw);
        if (confirmationRequired) {
          setMode("login");
          toast.success("Check your email to confirm your account, then sign in.");
          return;
        }
      }
      toast.success(mode === "login" ? "Welcome back ♡" : "Welcome to the club ♡");
      nav({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="paper-card p-8 md:p-10 max-w-sm w-full">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <img src={logoAsset} alt="" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-script text-2xl">
            MochaBlush<span className="text-primary">.Co</span>
          </span>
        </Link>
        <h1 className="mt-6 text-3xl text-center">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-center text-muted-foreground">
          {mode === "login"
            ? "Sign in to save your cart & wishlist."
            : "It's just an email and a password ♡"}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <Field label="Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                placeholder="Your first name"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@email.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
            />
          </Field>
          <button
            disabled={busy}
            className="w-full rounded-full bg-foreground text-background px-6 py-3 text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {busy ? "One sec…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-5 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "login"
            ? "New here? Create an account →"
            : "Already have an account? Sign in →"}
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
