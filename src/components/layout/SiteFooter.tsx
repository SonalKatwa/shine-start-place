import logoAsset from "@/assets/mylogo.jpg";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row gap-6 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src={logoAsset} alt="" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-script text-lg text-foreground">MochaBlush.Co</span>
        </div>
        <div className="flex gap-5">
          <a href="https://instagram.com/mochablush.co" className="hover:text-foreground">
            Instagram
          </a>
          <a href="mailto:hello@mochablush.co" className="hover:text-foreground">
            hello@mochablush.co
          </a>
        </div>
        <div>© {new Date().getFullYear()} MochaBlush.Co — made with ♡</div>
      </div>
    </footer>
  );
}
