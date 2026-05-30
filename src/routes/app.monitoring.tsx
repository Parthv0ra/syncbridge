import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/AppSidebar";
import { seedLogs, workflows, type LogEntry } from "@/lib/mock-data";
import { getConnectorLogs, type SyncLog } from "@/lib/mock-connectors";

export const Route = createFileRoute("/app/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring — SyncBridge" }] }),
  component: MonitoringPage,
});

type Level = LogEntry["level"];

const levelStyles: Record<Level, string> = {
  INFO: "text-sky-600",
  SUCCESS: "text-emerald-600",
  WARN: "text-amber-600",
  ERROR: "text-destructive",
};

function toLogEntry(z: SyncLog): LogEntry {
  return { ts: z.ts, level: z.level, workflow: z.workflow, message: z.message };
}

function merge(): LogEntry[] {
  return [...getConnectorLogs().map(toLogEntry), ...seedLogs];
}

function MonitoringPage() {
  const [logs, setLogs] = useState<LogEntry[]>(merge);
  const [filter, setFilter] = useState<Level | "ALL">("ALL");

  // Update when any connector sync fires
  useEffect(() => {
    const onLogs = () => setLogs(merge());
    window.addEventListener("syncbridge:connector-logs", onLogs);
    return () => window.removeEventListener("syncbridge:connector-logs", onLogs);
  }, []);

  // Simulate live activity every 3s
  useEffect(() => {
    const id = setInterval(() => {
      const sample = seedLogs[Math.floor(Math.random() * seedLogs.length)];
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLogs((prev) => [{ ...sample, ts }, ...prev].slice(0, 300));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const visible = filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  const wfName = (id: string) => {
    // connector sync workflows follow pattern: {connectorId}_sync
    if (id.endsWith("_sync")) {
      const name = id.replace("_sync", "");
      return name.charAt(0).toUpperCase() + name.slice(1) + " Sync";
    }
    return workflows.find((w) => w.id === id)?.name ?? id;
  };

  return (
    <>
      <PageHeader title="Monitoring" subtitle="Live execution logs and sync events." />

      <div className="flex gap-2 mb-4">
        {(["ALL", "INFO", "SUCCESS", "WARN", "ERROR"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === l
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {l}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
        </span>
      </div>

      <div className="rounded-xl border border-border bg-canvas overflow-hidden font-mono text-[11px]">
        <div className="max-h-[560px] overflow-y-auto">
          {visible.length === 0 && (
            <div className="px-4 py-8 text-center text-white/40">No logs found.</div>
          )}
          {visible.map((log, i) => (
            <div
              key={i}
              className="flex gap-3 px-4 py-1.5 border-b border-white/5 hover:bg-white/5"
            >
              <span className="text-white/40 shrink-0">{log.ts}</span>
              <span className={`shrink-0 w-14 font-bold ${levelStyles[log.level]}`}>
                [{log.level}]
              </span>
              <span className="text-white/50 shrink-0 truncate max-w-[180px]">
                {wfName(log.workflow)}
              </span>
              <span className="text-white/80">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
