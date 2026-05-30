import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { PageHeader } from "@/components/app/AppSidebar";
import { workflows as initialWorkflows, connectors, type Workflow } from "@/lib/mock-data";

export const Route = createFileRoute("/app/workflows")({
  head: () => ({ meta: [{ title: "Workflows — SyncBridge" }] }),
  component: WorkflowsPage,
});

type Status = "active" | "paused" | "error";

function WorkflowsPage() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", source: "", destination: "" });

  const filtered = filter === "all" ? workflows : workflows.filter((w) => w.status === filter);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.source || !form.destination) return;
    const newWorkflow: Workflow = {
      id: `wf_${Date.now()}`,
      name: form.name,
      source: form.source,
      destination: form.destination,
      status: "active",
      runs24h: 0,
      successRate: 100,
      lastRun: "just now",
    };
    setWorkflows((prev) => [newWorkflow, ...prev]);
    setForm({ name: "", source: "", destination: "" });
    setShowModal(false);
  }

  function handleToggleStatus(id: string) {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w,
      ),
    );
  }

  function handleDelete(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <>
      <PageHeader
        title="Workflows"
        subtitle="Manage your automation pipelines."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            New workflow
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "paused", "error"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Workflow</th>
              <th className="text-left py-3 font-semibold">Status</th>
              <th className="text-right py-3 font-semibold">Runs (24h)</th>
              <th className="text-right py-3 font-semibold">Success</th>
              <th className="text-right py-3 font-semibold">Last run</th>
              <th className="text-right px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground">
                  No workflows found.
                </td>
              </tr>
            )}
            {filtered.map((w) => (
              <tr key={w.id} className="border-t border-border hover:bg-surface transition-colors">
                <td className="px-5 py-3 font-medium">{w.name}</td>
                <td className="py-3">
                  <StatusPill status={w.status} />
                </td>
                <td className="py-3 text-right font-mono text-xs">{w.runs24h}</td>
                <td className="py-3 text-right font-mono text-xs">{w.successRate}%</td>
                <td className="py-3 text-right text-xs text-muted-foreground">{w.lastRun}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(w.id)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-border hover:bg-surface transition-colors"
                    >
                      {w.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Workflow Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">New workflow</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold mb-1.5 block">Workflow name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. HubSpot Deal → QuickBooks Invoice"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold mb-1.5 block">Source connector</span>
                <select
                  required
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
                >
                  <option value="">Select source…</option>
                  {connectors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold mb-1.5 block">Destination connector</span>
                <select
                  required
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
                >
                  <option value="">Select destination…</option>
                  {connectors
                    .filter((c) => c.id !== form.source)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-md border border-border text-sm font-semibold hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Create workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function StatusPill({ status }: { status: Status }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-700",
    paused: "bg-muted text-muted-foreground",
    error: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          status === "active"
            ? "bg-emerald-500 animate-pulse"
            : status === "error"
              ? "bg-destructive"
              : "bg-muted-foreground"
        }`}
      />
      {status}
    </span>
  );
}
