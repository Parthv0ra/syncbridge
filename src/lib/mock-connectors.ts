// Unified mock OAuth + API layer for all connectors

export type ConnectorId =
  | "hubspot"
  | "salesforce"
  | "zoho"
  | "quickbooks"
  | "xero"
  | "sheets"
  | "slack"
  | "sap"
  | "oracle";

export type OAuthToken = {
  connectorId: ConnectorId;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type SyncLog = {
  ts: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  workflow: string;
  message: string;
};

const TOKEN_PREFIX = "syncbridge.token.";
const LOGS_KEY = "syncbridge.connector.logs";

// --- Token helpers ---

export function saveToken(token: OAuthToken) {
  localStorage.setItem(TOKEN_PREFIX + token.connectorId, JSON.stringify(token));
  window.dispatchEvent(new CustomEvent("syncbridge:connector", { detail: token.connectorId }));
}

export function getToken(id: ConnectorId): OAuthToken | null {
  try {
    const raw = localStorage.getItem(TOKEN_PREFIX + id);
    return raw ? (JSON.parse(raw) as OAuthToken) : null;
  } catch {
    return null;
  }
}

export function clearToken(id: ConnectorId) {
  localStorage.removeItem(TOKEN_PREFIX + id);
  window.dispatchEvent(new CustomEvent("syncbridge:connector", { detail: id }));
}

export function isConnected(id: ConnectorId): boolean {
  const token = getToken(id);
  return token !== null && token.expiresAt > Date.now();
}

export function getAllConnectedIds(): ConnectorId[] {
  return (
    ["hubspot", "salesforce", "zoho", "quickbooks", "xero", "sheets", "slack", "sap", "oracle"] as ConnectorId[]
  ).filter(isConnected);
}

// --- OAuth flow ---

export function startOAuth(id: ConnectorId) {
  const state = Math.random().toString(36).slice(2);
  // Use connector-specific keys so multiple flows don't overwrite each other
  sessionStorage.setItem(`oauth_state_${id}`, state);
  sessionStorage.setItem("oauth_connector", id);
  window.location.href = `/oauth/callback?code=mock_code_${Date.now()}&state=${state}&connector=${id}`;
}

export function validateOAuthCallback(id: ConnectorId, state: string): boolean {
  const saved = sessionStorage.getItem(`oauth_state_${id}`);
  sessionStorage.removeItem(`oauth_state_${id}`);
  sessionStorage.removeItem("oauth_connector");
  return saved === state;
}

export function exchangeCode(id: ConnectorId, code: string): OAuthToken {
  const token: OAuthToken = {
    connectorId: id,
    accessToken: `mock_access_${id}_${code}`,
    refreshToken: `mock_refresh_${id}_${Date.now()}`,
    expiresAt: Date.now() + 3600 * 1000,
  };
  saveToken(token);
  return token;
}

// --- Logs ---

export function getConnectorLogs(): SyncLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as SyncLog[]) : [];
  } catch {
    return [];
  }
}

function addLog(log: SyncLog) {
  const logs = getConnectorLogs();
  localStorage.setItem(LOGS_KEY, JSON.stringify([log, ...logs].slice(0, 300)));
  window.dispatchEvent(new Event("syncbridge:connector-logs"));
}

function ts() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

// --- Mock sync data per connector ---

const syncData: Record<ConnectorId, { records: { label: string; count: number }[] }> = {
  hubspot: {
    records: [
      { label: "contacts", count: 142 },
      { label: "deals", count: 38 },
      { label: "companies", count: 27 },
    ],
  },
  salesforce: {
    records: [
      { label: "accounts", count: 89 },
      { label: "opportunities", count: 44 },
      { label: "contacts", count: 201 },
    ],
  },
  zoho: {
    records: [
      { label: "contacts", count: 5 },
      { label: "leads", count: 4 },
      { label: "deals", count: 4 },
    ],
  },
  quickbooks: {
    records: [
      { label: "invoices", count: 67 },
      { label: "customers", count: 53 },
      { label: "payments", count: 48 },
    ],
  },
  xero: {
    records: [
      { label: "invoices", count: 34 },
      { label: "contacts", count: 29 },
      { label: "bank transactions", count: 112 },
    ],
  },
  sheets: {
    records: [
      { label: "spreadsheets", count: 8 },
      { label: "rows synced", count: 1240 },
    ],
  },
  slack: {
    records: [
      { label: "channels", count: 12 },
      { label: "notifications sent", count: 88 },
    ],
  },
  sap: {
    records: [
      { label: "orders", count: 17 },
      { label: "inventory items", count: 304 },
    ],
  },
  oracle: {
    records: [
      { label: "GL entries", count: 92 },
      { label: "purchase orders", count: 21 },
    ],
  },
};

export function runSync(id: ConnectorId) {
  if (!isConnected(id)) return;
  const data = syncData[id];
  const name = id.charAt(0).toUpperCase() + id.slice(1);

  addLog({ ts: ts(), level: "INFO", workflow: `${id}_sync`, message: `${name} sync started` });

  let delay = 400;
  data.records.forEach(({ label, count }) => {
    setTimeout(() => {
      addLog({
        ts: ts(),
        level: "SUCCESS",
        workflow: `${id}_sync`,
        message: `Synced ${count} ${label} from ${name}`,
      });
    }, delay);
    delay += 400;
  });

  setTimeout(() => {
    const total = data.records.reduce((sum, r) => sum + r.count, 0);
    addLog({
      ts: ts(),
      level: "INFO",
      workflow: `${id}_sync`,
      message: `${name} sync complete — ${total} records processed`,
    });
  }, delay);
}
