import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { exchangeZohoCode, runZohoSync } from "@/lib/mock-zoho";

export const Route = createFileRoute("/oauth/zoho/callback")({
  component: ZohoCallbackPage,
});

function ZohoCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const savedState = sessionStorage.getItem("zoho_oauth_state");

    if (!code || state !== savedState) {
      setStatus("error");
      return;
    }

    sessionStorage.removeItem("zoho_oauth_state");

    // Simulate token exchange delay
    setTimeout(() => {
      exchangeZohoCode(code);
      runZohoSync();
      setStatus("success");
      setTimeout(() => navigate({ to: "/app/connectors" }), 1500);
    }, 1200);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
        {status === "processing" && (
          <>
            <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-bold mb-1">Connecting Zoho CRM</h2>
            <p className="text-sm text-muted-foreground">Exchanging authorization tokens…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-lg font-bold mb-1 text-emerald-700">Zoho CRM Connected</h2>
            <p className="text-sm text-muted-foreground">Redirecting you back to connectors…</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">✕</span>
            </div>
            <h2 className="text-lg font-bold mb-1 text-destructive">Connection Failed</h2>
            <p className="text-sm text-muted-foreground mb-5">Invalid or expired authorization code.</p>
            <button
              onClick={() => navigate({ to: "/app/connectors" })}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Back to Connectors
            </button>
          </>
        )}
      </div>
    </div>
  );
}
