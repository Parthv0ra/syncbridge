// Mock Zoho OAuth + API layer
// Simulates the full OAuth 2.0 flow and Zoho CRM REST API responses using localStorage

const TOKEN_KEY = "syncbridge.zoho.token";
const SYNC_LOG_KEY = "syncbridge.zoho.logs";

export type ZohoToken = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string[];
};

export type ZohoContact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
};

export type ZohoLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  source: string;
  status: string;
  createdAt: string;
};

export type ZohoDeal = {
  id: string;
  name: string;
  amount: number;
  stage: string;
  closeDate: string;
  ownerEmail: string;
  contactId: string;
};

export type ZohoSyncLog = {
  ts: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  workflow: string;
  message: string;
};

// --- Token helpers ---

export function saveZohoToken(token: ZohoToken) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  window.dispatchEvent(new Event("syncbridge:zoho"));
}

export function getZohoToken(): ZohoToken | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as ZohoToken) : null;
  } catch {
    return null;
  }
}

export function clearZohoToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("syncbridge:zoho"));
}

export function isZohoConnected(): boolean {
  const token = getZohoToken();
  return token !== null && token.expiresAt > Date.now();
}

// --- Mock OAuth ---
// Simulates: user clicks Connect → redirect to Zoho → Zoho redirects back with code
// In production this would be a real redirect to https://accounts.zoho.com/oauth/v2/auth

export function startZohoOAuth() {
  // Simulate the redirect by storing a pending state and navigating to our mock callback
  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem("zoho_oauth_state", state);
  // In production: window.location.href = `https://accounts.zoho.com/oauth/v2/auth?...`
  // For mock: navigate to our callback route with a fake code
  window.location.href = `/oauth/zoho/callback?code=mock_auth_code_${Date.now()}&state=${state}`;
}

// Called by the callback route to exchange the code for tokens
export function exchangeZohoCode(code: string): ZohoToken {
  // In production: POST to https://accounts.zoho.com/oauth/v2/token
  // For mock: generate fake tokens
  const token: ZohoToken = {
    accessToken: `mock_access_${code}`,
    refreshToken: `mock_refresh_${Date.now()}`,
    expiresAt: Date.now() + 3600 * 1000, // 1 hour
    scope: [
      "ZohoCRM.modules.contacts.ALL",
      "ZohoCRM.modules.leads.ALL",
      "ZohoCRM.modules.deals.ALL",
    ],
  };
  saveZohoToken(token);
  return token;
}

// --- Mock Zoho API responses ---

export function fetchZohoContacts(): ZohoContact[] {
  return [
    { id: "c1", firstName: "Alice", lastName: "Morgan", email: "alice@northstar.io", phone: "+1 555 0101", company: "NorthStar E-com", createdAt: "2026-05-28" },
    { id: "c2", firstName: "Ben", lastName: "Carter", email: "ben@brightlabs.co", phone: "+1 555 0102", company: "Bright Labs", createdAt: "2026-05-27" },
    { id: "c3", firstName: "Clara", lastName: "Diaz", email: "clara@mintly.io", phone: "+1 555 0103", company: "Mintly", createdAt: "2026-05-26" },
    { id: "c4", firstName: "David", lastName: "Kim", email: "david@acme.co", phone: "+1 555 0104", company: "Acme Co", createdAt: "2026-05-25" },
    { id: "c5", firstName: "Eva", lastName: "Rossi", email: "eva@looptech.io", phone: "+1 555 0105", company: "LoopTech", createdAt: "2026-05-24" },
  ];
}

export function fetchZohoLeads(): ZohoLead[] {
  return [
    { id: "l1", firstName: "Frank", lastName: "Wu", email: "frank@startup.io", company: "StartupIO", source: "Website", status: "New", createdAt: "2026-05-29" },
    { id: "l2", firstName: "Grace", lastName: "Hall", email: "grace@techco.com", company: "TechCo", source: "Referral", status: "Contacted", createdAt: "2026-05-28" },
    { id: "l3", firstName: "Henry", lastName: "Park", email: "henry@growfast.io", company: "GrowFast", source: "LinkedIn", status: "Qualified", createdAt: "2026-05-27" },
    { id: "l4", firstName: "Iris", lastName: "Chen", email: "iris@cloudbase.co", company: "CloudBase", source: "Cold Email", status: "New", createdAt: "2026-05-26" },
  ];
}

export function fetchZohoDeals(): ZohoDeal[] {
  return [
    { id: "d1", name: "NorthStar E-com — Annual", amount: 14400, stage: "Closed Won", closeDate: "2026-05-30", ownerEmail: "jane@acme.co", contactId: "c1" },
    { id: "d2", name: "Bright Labs — Growth Plan", amount: 5400, stage: "Proposal", closeDate: "2026-06-15", ownerEmail: "marcus@acme.co", contactId: "c2" },
    { id: "d3", name: "Mintly — Starter", amount: 1800, stage: "Negotiation", closeDate: "2026-06-10", ownerEmail: "jane@acme.co", contactId: "c3" },
    { id: "d4", name: "Acme Co — Scale", amount: 28800, stage: "Closed Won", closeDate: "2026-05-20", ownerEmail: "jane@acme.co", contactId: "c4" },
  ];
}

// --- Sync simulation ---
// Simulates pulling data from Zoho and logging it to monitoring

export function getSyncLogs(): ZohoSyncLog[] {
  try {
    const raw = localStorage.getItem(SYNC_LOG_KEY);
    return raw ? (JSON.parse(raw) as ZohoSyncLog[]) : [];
  } catch {
    return [];
  }
}

function addLog(log: ZohoSyncLog) {
  const logs = getSyncLogs();
  const updated = [log, ...logs].slice(0, 200);
  localStorage.setItem(SYNC_LOG_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("syncbridge:zoho-logs"));
}

function nowTs() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export function runZohoSync() {
  if (!isZohoConnected()) return;

  const contacts = fetchZohoContacts();
  const leads = fetchZohoLeads();
  const deals = fetchZohoDeals();

  addLog({ ts: nowTs(), level: "INFO", workflow: "zoho_sync", message: "Zoho CRM sync started" });

  setTimeout(() => {
    addLog({ ts: nowTs(), level: "SUCCESS", workflow: "zoho_sync", message: `Synced ${contacts.length} contacts from Zoho CRM` });
  }, 400);

  setTimeout(() => {
    addLog({ ts: nowTs(), level: "SUCCESS", workflow: "zoho_sync", message: `Synced ${leads.length} leads from Zoho CRM` });
  }, 800);

  setTimeout(() => {
    addLog({ ts: nowTs(), level: "SUCCESS", workflow: "zoho_sync", message: `Synced ${deals.length} deals from Zoho CRM` });
  }, 1200);

  setTimeout(() => {
    const total = contacts.length + leads.length + deals.length;
    addLog({ ts: nowTs(), level: "INFO", workflow: "zoho_sync", message: `Zoho CRM sync complete — ${total} records processed` });
  }, 1600);
}
