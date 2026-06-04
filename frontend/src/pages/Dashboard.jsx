import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Users,
  Map,
  FolderClock,
  TrendingUp,
  Inbox,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

// Sample business profile + records (placeholder data — wire to API later)
const BUSINESS = {
  name: "Apex Landscaping",
  location: "Brisbane, QLD",
  abn: "ABN 12 345 678 910",
  size: "Small Team / 1-5 Crew",
};

const KPIS = [
  { label: "Active Estimates", value: "12", sub: "$48,500 pending", icon: FileText, accent: "yellow" },
  { label: "Won Jobs This Month", value: "8", sub: "64% conversion rate", icon: TrendingUp, accent: "yellow" },
  { label: "Recent Enquiries", value: "3", sub: "Awaiting first response", icon: Inbox, accent: "muted" },
];

const QUOTES = [
  {
    client: "Melinda Rankine",
    scope: "Turf, Irrigation & Fencing",
    total: "$12,400 - $14,500",
    status: "Draft",
    date: "June 5",
  },
];

const STATUS_STYLES = {
  Draft: "border-zinc-700 text-neutral-300",
  Sent: "border-blue-500/50 text-blue-300",
  Won: "border-green-500/50 text-green-300",
  Lost: "border-red-500/50 text-red-300",
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = QUOTES.filter((q) =>
    `${q.client} ${q.scope} ${q.status}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <main data-testid="business-dashboard" className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        {/* 1. HEADER & IDENTITY BLOCK */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-yellow-500">
              TERRAIN PRO // Business Dashboard
            </span>
            <h1 className="mt-3 font-display uppercase text-3xl sm:text-4xl tracking-tight">
              G'day, <span className="text-yellow-500">{user?.name?.split(" ")[0] || "Tradie"}</span>
            </h1>
          </div>

          <div
            data-testid="business-meta"
            className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-3 min-w-[280px]"
          >
            <Meta label="Business" value={BUSINESS.name} />
            <Meta label="Location" value={BUSINESS.location} />
            <Meta label="Registration" value={BUSINESS.abn} />
            <Meta label="Crew Size" value={BUSINESS.size} />
          </div>
        </div>

        {/* 2. PRIMARY KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {KPIS.map((k) => (
            <div
              key={k.label}
              data-testid={`kpi-${k.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`group relative rounded-lg border border-zinc-800 border-l-2 bg-zinc-900/40 p-6 hover:bg-zinc-900 transition-colors ${
                k.accent === "muted" ? "border-l-zinc-700" : "border-l-yellow-500 hover:border-l-yellow-400"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  {k.label}
                </span>
                <k.icon
                  className={`w-5 h-5 transition-colors ${
                    k.accent === "muted" ? "text-neutral-600" : "text-yellow-500 group-hover:text-yellow-400"
                  }`}
                  strokeWidth={1.8}
                />
              </div>
              <div className="mt-4 font-display text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
                {k.value}
              </div>
              <div className="mt-2 text-sm text-neutral-400">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* 3. MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT — Recent quotes */}
          <section className="lg:col-span-8 rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="font-display uppercase text-xl tracking-tight text-white">
                Recent AI Quotes & Estimations
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  data-testid="quotes-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search quotes…"
                  className="h-10 pl-9 rounded-none bg-neutral-950 border-neutral-800 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left" data-testid="quotes-table">
                <thead>
                  <tr className="border-b border-zinc-800 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    <th className="py-3 pr-4 font-normal">Client</th>
                    <th className="py-3 pr-4 font-normal">Scope</th>
                    <th className="py-3 pr-4 font-normal">Total (AUD)</th>
                    <th className="py-3 pr-4 font-normal">Status</th>
                    <th className="py-3 font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q, i) => (
                    <tr
                      key={i}
                      data-testid={`quote-row-${i}`}
                      className="border-b border-zinc-800/60 hover:bg-zinc-900 transition-colors"
                    >
                      <td className="py-4 pr-4 font-display uppercase text-sm tracking-tight text-white">
                        {q.client}
                      </td>
                      <td className="py-4 pr-4 text-sm text-neutral-300">{q.scope}</td>
                      <td className="py-4 pr-4 font-mono text-sm text-yellow-500">{q.total}</td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-block border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
                            STATUS_STYLES[q.status] || STATUS_STYLES.Draft
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-xs text-neutral-400">{q.date}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-neutral-500">
                        No quotes match "{query}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* RIGHT — Quick actions */}
          <aside className="lg:col-span-4 rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-6">
            <h2 className="font-display uppercase text-xl tracking-tight text-white mb-5">
              Quick Actions & Workflows
            </h2>

            <button
              type="button"
              onClick={() => navigate("/quote")}
              data-testid="action-new-quote"
              className="w-full inline-flex items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-black uppercase tracking-[0.16em] text-sm border-2 border-black btn-industrial"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Start a New Quote
            </button>

            <div className="mt-4 space-y-3">
              <ActionLink icon={FileText} label="View Saved Invoices" testid="action-invoices" />
              <ActionLink icon={Users} label="Manage Client Profiles" testid="action-clients" />
              <ActionLink icon={Map} label="Check Supplier Map" testid="action-suppliers" />
              <ActionLink icon={FolderClock} label="Quote History" testid="action-history" />
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}

function Meta({ label, value }) {
  return (
    <div className="leading-tight">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">{label}</div>
      <div className="mt-1 font-display uppercase text-sm tracking-tight text-white">{value}</div>
    </div>
  );
}

function ActionLink({ icon: Icon, label, testid }) {
  return (
    <button
      type="button"
      data-testid={testid}
      className="group w-full inline-flex items-center gap-3 h-12 px-4 rounded-lg border border-zinc-800 text-neutral-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-colors"
    >
      <Icon className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" strokeWidth={1.8} />
      <span className="font-display uppercase text-sm tracking-tight">{label}</span>
    </button>
  );
}
