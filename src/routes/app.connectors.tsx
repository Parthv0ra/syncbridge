import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/AppSidebar";
import { connectors, type ConnectorCategory } from "@/lib/mock-data";
import { startOAuth, clearToken, isConnected, type ConnectorId } from "@/lib/mock-connectors";

export const Route = createFileRoute("/app/connectors")({
  head: () => ({ meta: [{ title: "Connectors — SyncBridge" }] }),
  component: ConnectorsPage,
});

const categories: ConnectorCategory[] = ["CRM", "Accounting", "Productivity", "ERP"];
type Status = "connected" | "available" | "error";

function ConnectorsPage() {
  const [filter, setFilter] = useState<ConnectorCategory | "All">("All");
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => {
    const s: Record<string, Status> = {};
    connectors.forEach((c) => {
      // Only mark as connected if a valid token exists in localStorage
      // Never inherit the hardcoded mock status from mock-data.ts
      s[c.id] = isConnected(c.id as ConnectorId) ? "connected" : "available";
    });
    return s;
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Keep statuses in sync when OAuth callback fires
  useEffect(() => {
    const sync = () => {
      setStatuses((prev) => {
        const updated = { ...prev };
        connectors.forEach((c) => {
          // Re-check each connector's token on every sync event
          updated[c.id] = isConnected(c.id as ConnectorId) ? "connected" : "available";
        });
        return updated;
      });
    };
    window.addEventListener("syncbridge:connector", sync);
    return () => window.removeEventListener("syncbridge:connector", sync);
  }, []);

  function handleToggle(id: string) {
    const status = statuses[id];
    if (status === "connected") {
      // Disconnect — clear token immediately
      clearToken(id as ConnectorId);
      setStatuses((prev) => ({ ...prev, [id]: "available" }));
    } else {
      // Connect — show loading then redirect to OAuth
      setLoading((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => startOAuth(id as ConnectorId), 600);
    }
  }

  const filtered =
    filter === "All" ? connectors : connectors.filter((c) => c.category === filter);

  return (
    <>
      <PageHeader title="Connectors" subtitle="Browse and manage your integrations." />

      <div className="flex gap-2 mb-6">
        {(["All", ...categories] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const status = statuses[c.id];
          const isLoading = loading[c.id] === true;
          const isConn = status === "connected";

          return (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-lg ${c.color} text-white text-sm font-bold flex items-center justify-center`}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.category}</div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    status === "connected"
                      ? "bg-emerald-500/10 text-emerald-700"
                      : status === "error"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                <span className="text-[11px] text-muted-foreground">
                  {c.installs.toLocaleString()} installs
                </span>
                <button
                  onClick={() => handleToggle(c.id)}
                  disabled={isLoading}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isConn
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {isLoading ? "Connecting…" : isConn ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
