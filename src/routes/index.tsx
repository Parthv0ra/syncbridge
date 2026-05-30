import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Workflow, Activity, Boxes, Zap, Shield, GitBranch } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { HeroProductMock } from "@/components/marketing/HeroProductMock";
import { connectors, plans } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SyncBridge — Connect Your Business Tools. Automate Everything." },
      { name: "description", content: "The no-code integration platform for SMEs. Connect CRM, accounting, ERP and spreadsheets with visual workflows and real-time sync monitoring." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <MarketingNav />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-7">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/15 text-[11px] font-bold uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Now in public beta
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Connect Your Business Tools.{" "}
              <span className="text-primary">Automate Everything.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-[44ch]">
              SyncBridge helps SMEs eliminate manual data transfer across CRM, accounting, ERP, and spreadsheets — with no code.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-md shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
              >
                Start Automating <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center font-semibold px-5 py-3 rounded-md border border-border bg-card hover:bg-surface transition-colors"
              >
                Open live demo
              </Link>
            </div>
            <div className="pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Connects with
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground">
                {connectors.slice(0, 6).map((c) => (
                  <span key={c.id}>{c.name}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <HeroProductMock />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-border bg-surface py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">The problem</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-3xl mx-auto">
            Your team spends hours every week copy-pasting data between tools that should already talk to each other.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Zapier feels too shallow. Workato is built for enterprise budgets. SyncBridge is the integration layer for ops teams at 10–500 person companies.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-0 border border-border rounded-xl overflow-hidden">
            {[
              { Icon: Workflow, title: "Visual workflow builder", body: "Drag-drop trigger and action nodes. Add filters, branches, retries — no code required." },
              { Icon: GitBranch, title: "Smart field mapping", body: "Map source to destination fields with type checks, transforms, and preview mode." },
              { Icon: Activity, title: "Real-time monitoring", body: "Live execution logs, queue status, retry history. Never wonder why a sync failed." },
              { Icon: Boxes, title: "Deep connectors", body: "Native integrations for HubSpot, Salesforce, QuickBooks, Xero, SAP, Oracle, Sheets, Slack." },
              { Icon: Shield, title: "Enterprise-ready", body: "SSO, role-based access, audit logs, and SOC 2-aligned controls on every plan." },
              { Icon: Zap, title: "Sub-second triggers", body: "Webhook-based execution beats polling by minutes. Critical events sync instantly." },
            ].map(({ Icon, title, body }, i) => (
              <div
                key={title}
                className={`p-7 bg-card ${i % 3 !== 2 ? "md:border-r" : ""} ${i < 3 ? "border-b" : ""} border-border`}
              >
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Icon className="size-4" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-border bg-surface py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Pricing built for SMEs</h2>
            <p className="mt-3 text-muted-foreground">Flat monthly tiers. No per-task surprises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-xl bg-card p-7 flex flex-col ${
                  p.popular ? "border-2 border-primary shadow-xl" : "border border-border"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{p.name}</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${p.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-6 space-y-2.5 text-sm flex-grow">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 items-center">
                      <Check className="size-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-7 text-center w-full py-2.5 rounded-md font-semibold text-sm transition-colors ${
                    p.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-surface"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { quote: "SyncBridge replaced four Zapier workspaces and a part-time ops contractor. The mapping UI alone is worth the price.", name: "Sarah Jenkins", role: "Head of Ops, NorthStar E-com" },
            { quote: "We connected HubSpot to QuickBooks in 15 minutes. Three months in, zero silent failures.", name: "Marcus Lee", role: "RevOps, Bright Labs" },
            { quote: "Finally an integration tool that respects technical operators without enterprise pricing.", name: "Aiko Tanaka", role: "CTO, Mintly" },
          ].map((t) => (
            <figure key={t.name} className="rounded-xl border border-border bg-card p-6">
              <blockquote className="text-sm leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 pt-5 border-t border-border">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-canvas text-white p-12 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Ready to bridge the gap?</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              Join 500+ teams automating their operational backend with SyncBridge.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Automating <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
