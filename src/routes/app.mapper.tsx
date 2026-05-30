import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { PageHeader } from "@/components/app/AppSidebar";
import { sourceFields, destFields, initialMapping } from "@/lib/mock-data";

export const Route = createFileRoute("/app/mapper")({
  head: () => ({ meta: [{ title: "Field Mapper — SyncBridge" }] }),
  component: MapperPage,
});

const typeColors: Record<string, string> = {
  string: "bg-sky-500/10 text-sky-700",
  number: "bg-violet-500/10 text-violet-700",
  date: "bg-amber-500/10 text-amber-700",
  bool: "bg-emerald-500/10 text-emerald-700",
};

function MapperPage() {
  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);
  const [selected, setSelected] = useState<string | null>(null);

  const map = (src: string, dst: string) => {
    setMapping((m) => ({ ...m, [src]: dst }));
    setSelected(null);
  };

  const unmap = (src: string) => setMapping((m) => { const n = { ...m }; delete n[src]; return n; });

  return (
    <>
      <PageHeader title="Field Mapper" subtitle="Map source fields to destination fields." />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Source */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-surface">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Source · HubSpot Deal</div>
          </div>
          <ul className="divide-y divide-border">
            {sourceFields.map((f) => (
              <li
                key={f.name}
                onClick={() => setSelected(selected === f.name ? null : f.name)}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  selected === f.name ? "bg-primary/5" : "hover:bg-surface"
                } ${mapping[f.name] ? "opacity-50" : ""}`}
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColors[f.type]}`}>{f.type}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-medium">{f.name}</div>
                  <div className="text-[11px] text-muted-foreground">{f.sample}</div>
                </div>
                {mapping[f.name] && (
                  <button onClick={(e) => { e.stopPropagation(); unmap(f.name); }} className="text-muted-foreground hover:text-destructive">
                    <X className="size-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mappings */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-surface">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active mappings</div>
          </div>
          <ul className="divide-y divide-border">
            {Object.entries(mapping).map(([src, dst]) => (
              <li key={src} className="px-4 py-3 flex items-center gap-2 text-xs font-mono">
                <span className="text-foreground truncate">{src}</span>
                <ArrowRight className="size-3 text-primary shrink-0" />
                <span className="text-primary truncate">{dst}</span>
              </li>
            ))}
            {Object.keys(mapping).length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-muted-foreground">No mappings yet</li>
            )}
          </ul>
        </div>

        {/* Destination */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-surface">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination · QuickBooks Invoice</div>
          </div>
          <ul className="divide-y divide-border">
            {destFields.map((f) => {
              const isMapped = Object.values(mapping).includes(f.name);
              return (
                <li
                  key={f.name}
                  onClick={() => selected && !isMapped && map(selected, f.name)}
                  className={`px-4 py-3 flex items-center gap-3 transition-colors ${
                    selected && !isMapped ? "cursor-pointer hover:bg-primary/5" : ""
                  } ${isMapped ? "opacity-50" : ""}`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColors[f.type]}`}>{f.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-medium">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.sample}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {selected && (
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Click a destination field to map <span className="font-mono text-primary">{selected}</span>
        </p>
      )}
    </>
  );
}
