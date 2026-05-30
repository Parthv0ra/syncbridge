import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Boxes, Workflow, GitBranch, Activity, CreditCard, ShieldCheck, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { signOut, useMockAuth } from "@/lib/mock-auth";
import { useNavigate } from "@tanstack/react-router";

const nav = [
  { to: "/app", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/app/connectors", label: "Connectors", Icon: Boxes },
  { to: "/app/workflows", label: "Workflows", Icon: Workflow },
  { to: "/app/mapper", label: "Field Mapper", Icon: GitBranch },
  { to: "/app/monitoring", label: "Monitoring", Icon: Activity },
  { to: "/app/billing", label: "Billing", Icon: CreditCard },
  { to: "/app/admin", label: "Admin", Icon: ShieldCheck },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useMockAuth();
  const navigate = useNavigate();
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
      <div className="h-14 px-5 flex items-center border-b border-border">
        <Link to="/"><Logo /></Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ to, label, Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="px-2.5 py-2 mb-2">
          <div className="text-xs font-semibold truncate">{user?.name ?? "Demo User"}</div>
          <div className="text-[11px] text-muted-foreground truncate">{user?.workspace ?? "Acme Co"} · {user?.role ?? "owner"}</div>
        </div>
        <button
          onClick={() => { signOut(); navigate({ to: "/" }); }}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}