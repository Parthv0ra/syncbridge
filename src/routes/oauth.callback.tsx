import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { exchangeCode, validateOAuthCallback, runSync, type ConnectorId } from "@/lib/mock-connectors";

export const Route = createFileRoute("/oauth/callback")({
  component: OAuthCallbackPage,
});

const connectorNames: Record<ConnectorId, string> = {
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  zoho: "Zoho CRM",
  quickbooks: "QuickBooks",
  xero: "Xero",
  sheets: "Google Sheets",
  slack: "Slack",
  sap: "SAP",
  oracle: "Oracle ERP",
};

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [connectorId, setConnectorId] = useState<ConnectorId | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const connector = params.get("connector") as ConnectorId;

    if (!code || !state || !connector || !validateOAuthCallback(connector, state)) {
      setStatus("error");
      return;
    }

    setConnectorId(connector);

    setTimeout(() => {
      exchangeCode(connector, code);
      runSync(connector);
      setStatus("success");
      setTimeout(() => navigate({ to: "/app/connectors" }), 1500);
    }, 1200);
  }, [navigate]);

  const name = connectorId ? connectorNames[connectorId] : "Connector";

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
        {status === "processing" && (
          <>
            <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-bold mb-1">Connecting {name}</h2>
            <p className="text-sm text-muted-foreground">Exchanging authorization tokens…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
              <span className="text-emerald-600 text-2xl font-bold">✓</span>
            </div>
            <h2 className="text-lg font-bold mb-1 text-emerald-700">{name} Connected</h2>
            <p className="text-sm text-muted-foreground">Redirecting you back to connectors…</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
              <span className="text-destructive text-2xl font-bold">✕</span>
            </div>
            <h2 className="text-lg font-bold mb-1 text-destructive">Connection Failed</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Invalid or expired authorization code.
            </p>
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
