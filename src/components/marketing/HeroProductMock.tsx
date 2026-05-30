export function HeroProductMock() {
  return (
    <div className="relative">
      <div className="bg-surface rounded-xl border border-border shadow-2xl overflow-hidden ring-1 ring-black/5">
        <div className="h-9 border-b border-border bg-card flex items-center px-4 gap-4">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-muted" />
            <div className="size-2.5 rounded-full bg-muted" />
            <div className="size-2.5 rounded-full bg-muted" />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">app.syncbridge.io/workflows/wf_1</div>
        </div>
        <div className="h-[460px] relative bg-[radial-gradient(circle,oklch(0.92_0.008_255.508)_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="absolute inset-0 p-8 flex items-center justify-center">
            <div className="flex items-center gap-10">
              <div className="w-48 bg-card border-2 border-primary rounded-lg shadow-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-5 bg-orange-500 rounded text-[9px] font-bold text-white flex items-center justify-center">HS</div>
                  <span className="text-xs font-bold">HubSpot Trigger</span>
                </div>
                <div className="text-[11px] text-muted-foreground">New Deal Closed</div>
                <div className="mt-3 space-y-1.5">
                  <div className="h-1.5 w-full bg-muted rounded" />
                  <div className="h-1.5 w-2/3 bg-muted rounded" />
                </div>
              </div>
              <div className="h-[2px] w-10 bg-primary/40 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary" />
              </div>
              <div className="w-52 bg-card border border-border rounded-lg shadow-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-5 bg-primary rounded" />
                  <span className="text-xs font-bold">Field Mapping</span>
                </div>
                <div className="text-[10px] font-mono space-y-1 text-muted-foreground">
                  <div className="flex justify-between"><span>deal.amount</span><span className="text-primary">→ total</span></div>
                  <div className="flex justify-between"><span>deal.id</span><span className="text-primary">→ ref</span></div>
                  <div className="flex justify-between"><span>close_date</span><span className="text-primary">→ date</span></div>
                </div>
              </div>
              <div className="h-[2px] w-10 bg-primary/40 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary" />
              </div>
              <div className="w-44 bg-card border border-border rounded-lg shadow-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-5 bg-emerald-600 rounded text-[9px] font-bold text-white flex items-center justify-center">QB</div>
                  <span className="text-xs font-bold">QuickBooks</span>
                </div>
                <div className="text-[11px] text-muted-foreground">Create Invoice</div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
                  <span className="size-1 rounded-full bg-emerald-500" /> SYNCED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-4 w-64 bg-canvas rounded-lg shadow-2xl p-3 font-mono text-[10px] text-emerald-400 border border-white/10 hidden md:block">
        <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1.5">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white/60">LIVE_EXECUTION_LOG</span>
        </div>
        <div className="space-y-0.5 text-[10px]">
          <p>14:22:01 [INFO] REQ_AUTH_SUCCESS</p>
          <p>14:22:01 [INFO] DATA_MAP_V2_APPLIED</p>
          <p className="text-primary">14:22:02 [SYNC] 402 RECORDS PUSHED</p>
          <p>14:22:02 [DONE] STATUS_OK</p>
        </div>
      </div>
    </div>
  );
}