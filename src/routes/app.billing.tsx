import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/app/AppSidebar";
import { plans, invoices, revenueSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing — SyncBridge" }] }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" subtitle="Manage your subscription and invoices." />

      {/* Current plan summary */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Current plan</div>
          <div className="text-xl font-bold">Growth · $149 / month</div>
          <div className="text-xs text-muted-foreground mt-0.5">Next billing date: Jun 30, 2026</div>
        </div>
        <button className="text-sm font-semibold border border-border px-4 py-2 rounded-md hover:bg-surface transition-colors">
          Manage subscription
        </button>
      </div>

      {/* MRR chart */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <h3 className="font-semibold mb-1">MRR growth</h3>
        <p className="text-xs text-muted-foreground mb-4">Last 6 months</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.546 0.215 262.881)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.546 0.215 262.881)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.92 0.008 255.508)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="oklch(0.6 0.027 257.417)" />
              <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.6 0.027 257.417)" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="mrr" stroke="oklch(0.546 0.215 262.881)" strokeWidth={2} fill="url(#mrrGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plans */}
      <h3 className="font-semibold mb-4">Available plans</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {plans.map((p) => (
          <div key={p.id} className={`relative rounded-xl bg-card p-6 flex flex-col ${p.popular ? "border-2 border-primary" : "border border-border"}`}>
            {p.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                Current
              </span>
            )}
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{p.name}</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold">${p.price}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-4 space-y-2 text-xs flex-grow">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 items-center"><Check className="size-3.5 text-primary shrink-0" />{f}</li>
              ))}
            </ul>
            <button className={`mt-5 w-full py-2 rounded-md text-sm font-semibold transition-colors ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:bg-surface"}`}>
              {p.popular ? "Current plan" : p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <h3 className="font-semibold mb-4">Invoice history</h3>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Invoice</th>
              <th className="text-left py-3 font-semibold">Date</th>
              <th className="text-right py-3 font-semibold">Amount</th>
              <th className="text-right px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-border">
                <td className="px-5 py-3 font-mono text-xs">{inv.id}</td>
                <td className="py-3 text-xs text-muted-foreground">{inv.date}</td>
                <td className="py-3 text-right font-mono text-xs">{inv.amount}</td>
                <td className="px-5 py-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded">
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
