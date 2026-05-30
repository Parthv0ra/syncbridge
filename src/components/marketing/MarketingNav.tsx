import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-base">
            <Logo />
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/app/connectors" className="hover:text-foreground transition-colors">Connectors</Link>
            <Link to="/app" className="hover:text-foreground transition-colors">Live demo</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-medium px-3 py-1.5 rounded-md hover:bg-surface transition-colors">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-md shadow-sm hover:bg-primary/90 transition-colors"
          >
            Start Automating
          </Link>
        </div>
      </div>
    </nav>
  );
}