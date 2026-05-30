import { Logo } from "@/components/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <Logo />
          <p className="text-xs text-muted-foreground">© 2026 SyncBridge, Inc.</p>
        </div>
        <div className="flex gap-8 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          <a href="#" className="hover:text-foreground">Status</a>
          <a href="#" className="hover:text-foreground">Security</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
        </div>
      </div>
    </footer>
  );
}