import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, CheckCircle2, AlertTriangle, Activity, Workflow as WorkflowIcon } from "lucide-react";
import { PageHeader } from "@/components/app/AppSidebar";
import { connectors, workflows, syncSeries, queueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — SyncBridge" }] }),
  component: Dashboard,
});

const kpis = [
  { label: "Active integrations", value: "12", delta: "+2", Icon: WorkflowIcon, tint: "text-primary bg-primary/10" },
  { label: "Sync success rate", value: "99.4%", delta: "+0.3%", Icon: CheckCircle2, tint: "text-emerald-600 bg-emerald-500/10" },
  { label: "Failed jobs (24h)", value: "8", delta: "-12", Icon: AlertTriangle, tint: "text-amber-600 bg-amber-500/10" },
  { label: "Events processed", value: "42.1k", delta: "+18%", Icon: Activity, tint: "text-violet-600 bg-violet-500/10" },
];

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your integration health."
        action={
          <Link to="/app/workflows" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            New workflow
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, delta, Icon, tint }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className={`size-9 rounded-lg flex items-center justify-center ${tint}`}>
                <Icon className="size-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                <ArrowUpRight className="size-3" /> {delta}
              </span>
            </div>
            <div className="mt-4 text-2xl font-bold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Sync volume</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Success</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> Failed</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={syncSeries} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.546 0.215 262.881)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.546 0.215 262.881)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.92 0.008 255.508)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="oklch(0.6 0.027 257.417)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.6 0.027 257.417)" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid oklch(0.92 0.008 255.508)" }} />
                <Area type="monotone" dataKey="success" stroke="oklch(0.546 0.215 262.881)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="failed" stroke="oklch(0.62 0.23 27.325)" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Queue depth</h3>
          <p className="text-xs text-muted-foreground">Last 24h</p>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queueSeries} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid stroke="oklch(0.92 0.008 255.508)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="oklch(0.6 0.027 257.417)" interval={3} />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.6 0.027 257.417)" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="queued" fill="oklch(0.546 0.215 262.881)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Active workflows</h3>
            <Link to="/app/workflows" className="text-xs font-semibold text-primary">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface">
              <tr>
                <th className="text-left px-5 py-2.5 font-semibold">Workflow</th>
                <th className="text-left py-2.5 font-semibold">Status</th>
                <th className="text-right py-2.5 font-semibold">Runs (24h)</th>
                <th className="text-right px-5 py-2.5 font-semibold">Success</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((w) => (
                <tr key={w.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{w.name}</td>
                  <td className="py-3">
                    <StatusPill status={w.status} />
                  </td>
                  <td className="py-3 text-right font-mono text-xs">{w.runs24h}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs">{w.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Connector health</h3>
          <ul className="space-y-3">
            {connectors.slice(0, 6).map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <div className={`size-7 rounded ${c.color} text-white text-[10px] font-bold flex items-center justify-center`}>{c.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.category}</div>
                </div>
                <StatusDot status={c.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: "active" | "paused" | "error" }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-700",
    paused: "bg-muted text-muted-foreground",
    error: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      <span className={`size-1.5 rounded-full ${status === "active" ? "bg-emerald-500 animate-pulse" : status === "error" ? "bg-destructive" : "bg-muted-foreground"}`} />
      {status}
    </span>
  );
}

function StatusDot({ status }: { status: "connected" | "available" | "error" }) {
  const color = status === "connected" ? "bg-emerald-500" : status === "error" ? "bg-destructive" : "bg-muted-foreground";
  return <span className={`size-2 rounded-full ${color}`} title={status} />;
}