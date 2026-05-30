export type ConnectorCategory = "CRM" | "Accounting" | "Productivity" | "ERP";
export type Connector = {
  id: string;
  name: string;
  category: ConnectorCategory;
  color: string;
  initials: string;
  status: "connected" | "available" | "error";
  description: string;
  installs: number;
};

export const connectors: Connector[] = [
  { id: "hubspot", name: "HubSpot", category: "CRM", color: "bg-orange-500", initials: "HS", status: "connected", description: "Sync contacts, deals, and companies in real time.", installs: 12400 },
  { id: "salesforce", name: "Salesforce", category: "CRM", color: "bg-sky-500", initials: "SF", status: "connected", description: "Bi-directional CRM sync for accounts and opportunities.", installs: 9870 },
  { id: "zoho", name: "Zoho CRM", category: "CRM", color: "bg-red-500", initials: "ZH", status: "available", description: "Pipeline and lead sync with Zoho CRM.", installs: 4220 },
  { id: "quickbooks", name: "QuickBooks", category: "Accounting", color: "bg-emerald-600", initials: "QB", status: "connected", description: "Invoices, customers, and payments sync.", installs: 8810 },
  { id: "xero", name: "Xero", category: "Accounting", color: "bg-cyan-600", initials: "XR", status: "available", description: "Accounting records sync with Xero Online.", installs: 6190 },
  { id: "sheets", name: "Google Sheets", category: "Productivity", color: "bg-green-600", initials: "GS", status: "connected", description: "Treat any sheet as a real-time database.", installs: 14200 },
  { id: "slack", name: "Slack", category: "Productivity", color: "bg-violet-600", initials: "SL", status: "available", description: "Pipe sync events and alerts into channels.", installs: 11030 },
  { id: "sap", name: "SAP", category: "ERP", color: "bg-blue-800", initials: "SA", status: "error", description: "Enterprise ERP sync for orders and inventory.", installs: 2100 },
  { id: "oracle", name: "Oracle ERP", category: "ERP", color: "bg-rose-700", initials: "OR", status: "available", description: "Connect Oracle Fusion ERP modules.", installs: 1840 },
];

export type Workflow = {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: "active" | "paused" | "error";
  runs24h: number;
  successRate: number;
  lastRun: string;
};

export const workflows: Workflow[] = [
  { id: "wf_1", name: "HubSpot Deal → QuickBooks Invoice", source: "hubspot", destination: "quickbooks", status: "active", runs24h: 482, successRate: 99.4, lastRun: "12s ago" },
  { id: "wf_2", name: "Salesforce Contact → Google Sheets", source: "salesforce", destination: "sheets", status: "active", runs24h: 1240, successRate: 100, lastRun: "4s ago" },
  { id: "wf_3", name: "Xero Invoice → Slack #finance", source: "xero", destination: "slack", status: "paused", runs24h: 0, successRate: 98.2, lastRun: "2h ago" },
  { id: "wf_4", name: "SAP Order → HubSpot Deal", source: "sap", destination: "hubspot", status: "error", runs24h: 17, successRate: 64.8, lastRun: "1m ago" },
  { id: "wf_5", name: "Sheets Lead → Salesforce Contact", source: "sheets", destination: "salesforce", status: "active", runs24h: 312, successRate: 99.9, lastRun: "38s ago" },
];

export const syncSeries = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  success: 800 + Math.round(Math.sin(i / 2) * 120 + i * 40),
  failed: Math.max(2, Math.round(Math.abs(Math.cos(i)) * 18)),
}));

export const queueSeries = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  queued: Math.round(40 + Math.sin(i / 3) * 30 + Math.random() * 20),
}));

export type LogEntry = {
  ts: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  workflow: string;
  message: string;
};

export const seedLogs: LogEntry[] = [
  { ts: "14:22:01", level: "SUCCESS", workflow: "wf_1", message: "Synced Invoice #8829 to QuickBooks Online" },
  { ts: "14:21:58", level: "INFO", workflow: "wf_1", message: "Trigger received from HubSpot: Deal ID 992-K" },
  { ts: "14:21:45", level: "SUCCESS", workflow: "wf_2", message: "Pushed 24 contacts to Salesforce" },
  { ts: "14:21:30", level: "WARN", workflow: "wf_4", message: "SAP rate limit approaching (89/100)" },
  { ts: "14:21:12", level: "ERROR", workflow: "wf_4", message: "SAP order 778 missing required field: ship_to" },
  { ts: "14:20:58", level: "SUCCESS", workflow: "wf_5", message: "Mapped 1 sheet row to Salesforce contact" },
  { ts: "14:20:31", level: "INFO", workflow: "wf_1", message: "Field mapping v2 applied" },
  { ts: "14:20:04", level: "SUCCESS", workflow: "wf_2", message: "Webhook ack from Salesforce in 142ms" },
];

export type SourceField = { name: string; type: "string" | "number" | "date" | "bool"; sample: string };
export const sourceFields: SourceField[] = [
  { name: "deal.id", type: "string", sample: "992-K" },
  { name: "deal.amount", type: "number", sample: "12,400.00" },
  { name: "deal.close_date", type: "date", sample: "2026-05-30" },
  { name: "deal.owner_email", type: "string", sample: "jane@acme.co" },
  { name: "deal.stage", type: "string", sample: "closed_won" },
  { name: "deal.currency", type: "string", sample: "USD" },
];

export const destFields: SourceField[] = [
  { name: "invoice.ref", type: "string", sample: "INV-992K" },
  { name: "invoice.total", type: "number", sample: "12400.00" },
  { name: "invoice.date", type: "date", sample: "2026-05-30" },
  { name: "invoice.contact_email", type: "string", sample: "jane@acme.co" },
  { name: "invoice.status", type: "string", sample: "paid" },
  { name: "invoice.currency", type: "string", sample: "USD" },
];

export const initialMapping: Record<string, string> = {
  "deal.id": "invoice.ref",
  "deal.amount": "invoice.total",
  "deal.close_date": "invoice.date",
  "deal.owner_email": "invoice.contact_email",
};

export const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    tagline: "For small teams starting automation.",
    features: ["5 active workflows", "3 connectors", "1,000 ops / mo", "Email support"],
    cta: "Choose Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: 149,
    tagline: "Scale operations with advanced logic.",
    features: ["25 workflows", "All connectors", "10,000 ops / mo", "Advanced mapping", "Priority email"],
    cta: "Get Growth",
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 399,
    tagline: "For ops-critical pipelines.",
    features: ["Unlimited workflows", "100k+ ops / mo", "SSO & roles", "Dedicated success", "Audit log export"],
    cta: "Contact Sales",
  },
];

export const invoices = [
  { id: "INV-2026-0429", date: "Apr 30, 2026", amount: "$149.00", status: "Paid" },
  { id: "INV-2026-0331", date: "Mar 31, 2026", amount: "$149.00", status: "Paid" },
  { id: "INV-2026-0228", date: "Feb 28, 2026", amount: "$149.00", status: "Paid" },
  { id: "INV-2026-0131", date: "Jan 31, 2026", amount: "$49.00", status: "Paid" },
];

export const adminUsers = [
  { id: "u1", name: "Jane Patel", email: "jane@acme.co", role: "owner", workflows: 12, status: "Active" },
  { id: "u2", name: "Marcus Lee", email: "marcus@acme.co", role: "admin", workflows: 6, status: "Active" },
  { id: "u3", name: "Sara Voss", email: "sara@acme.co", role: "member", workflows: 3, status: "Active" },
  { id: "u4", name: "Tom Rivera", email: "tom@vendor.io", role: "member", workflows: 1, status: "Invited" },
];

export const revenueSeries = [
  { month: "Dec", mrr: 18400 },
  { month: "Jan", mrr: 21900 },
  { month: "Feb", mrr: 26800 },
  { month: "Mar", mrr: 31200 },
  { month: "Apr", mrr: 38900 },
  { month: "May", mrr: 47500 },
];