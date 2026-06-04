import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  Search,
  FileText,
  Users,
  Map,
  FolderClock,
  TrendingUp,
  Inbox,
  Clock,
  Check,
  Pencil,
  ChevronDown,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

// Sample business profile (placeholder data — wire to API later)
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

const SAMPLE_QUOTES = [
  {
    client: "Melinda Rankine",
    scope: "Turf, Irrigation & Fencing",
    total: "$12,400 - $14,500",
    status: "Draft",
    date: "June 5",
  },
];

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtMoney = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 })
    : "—";

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
  const [quotes, setQuotes] = useState(null);
  const [metaOpen, setMetaOpen] = useState(false);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API}/quotes`)
      .then(({ data }) => {
        if (!active) return;
        const mapped = (data || []).map((q) => ({
          client: q.client || "Customer",
          scope: q.scope_summary || "—",
          total: `${fmtMoney(q.total_low)} - ${fmtMoney(q.total_high)}`,
          status: q.status || "Draft",
          date: q.created_at
            ? new Date(q.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })
            : "",
        }));
        setQuotes(mapped);
      })
      .catch(() => setQuotes([]));
    return () => {
      active = false;
    };
  }, []);

  const rows = quotes && quotes.length ? quotes : SAMPLE_QUOTES;
  const filtered = rows.filter((q) =>
    `${q.client} ${q.scope} ${q.status}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <main
        data-testid="business-dashboard"
        className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-5 pb-6 sm:pb-10"
      >
        {/* 1. HEADER & IDENTITY BLOCK */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-5 lg:items-start">
            <div className="lg:col-span-2 lg:mt-14">
              <span className="md:hidden font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-yellow-500">
                TERRAIN PRO // Business Dashboard
              </span>
              <div className="mt-2 sm:mt-3 lg:mt-0 flex items-center gap-3 sm:gap-4">
                <div
                  data-testid="business-logo-placeholder"
                  className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 grid place-items-center rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40"
                  title="Add your business logo"
                >
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" strokeWidth={1.6} />
                </div>
                <h1 className="font-display uppercase text-2xl sm:text-4xl tracking-tight leading-none">
                  G'day,{" "}
                  <span className="text-yellow-500">
                    {user?.name?.split(" ")[0] || "Tradie"}
                  </span>
                </h1>
              </div>
            </div>

            {/* Desktop: side-by-side info grid */}
            <div
              data-testid="business-meta"
              className="hidden lg:grid lg:col-span-2 lg:col-start-3 lg:mt-14 rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 px-5 py-4 grid-cols-2 gap-x-8 gap-y-3"
            >
              <Meta label="Business" value={BUSINESS.name} />
              <Meta label="Location" value={BUSINESS.location} />
              <Meta label="Registration" value={BUSINESS.abn} />
              <Meta label="Crew Size" value={BUSINESS.size} />
            </div>
          </div>

          {/* Mobile: collapsible "Business Info" dropdown */}
          <div className="lg:hidden mt-4">
            <button
              type="button"
              onClick={() => setMetaOpen((o) => !o)}
              data-testid="business-meta-toggle"
              aria-expanded={metaOpen}
              className="w-full flex items-center justify-between rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 px-4 py-3"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-yellow-500 shrink-0" strokeWidth={1.8} />
                <span className="font-display uppercase text-sm tracking-tight text-white truncate">
                  {BUSINESS.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 truncate">
                  · {BUSINESS.location}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                  metaOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {metaOpen && (
              <div
                data-testid="business-meta-mobile"
                className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-4 grid grid-cols-2 gap-x-6 gap-y-3"
              >
                <Meta label="Business" value={BUSINESS.name} />
                <Meta label="Location" value={BUSINESS.location} />
                <Meta label="Registration" value={BUSINESS.abn} />
                <Meta label="Crew Size" value={BUSINESS.size} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile-priority CTA: top of screen below header */}
        <button
          type="button"
          onClick={() => navigate("/quote")}
          data-testid="action-new-quote-mobile"
          className="lg:hidden w-full inline-flex items-center justify-center gap-2 h-14 mb-6 bg-yellow-500 text-black font-black uppercase tracking-[0.16em] text-sm border-2 border-black btn-industrial"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Start a New Quote
        </button>

        {/* 2. KPI METRICS — 2x2 on mobile, 4-up on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {KPIS.map((k) => (
            <div
              key={k.label}
              data-testid={`kpi-${k.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`group relative rounded-lg border border-zinc-800 border-l-2 bg-zinc-900/40 p-4 sm:p-6 hover:bg-zinc-900 transition-colors ${
                k.accent === "muted"
                  ? "border-l-zinc-700"
                  : "border-l-yellow-500 hover:border-l-yellow-400"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 leading-tight">
                  {k.label}
                </span>
                <k.icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-colors ${
                    k.accent === "muted"
                      ? "text-neutral-600"
                      : "text-yellow-500 group-hover:text-yellow-400"
                  }`}
                  strokeWidth={1.8}
                />
              </div>
              <div className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
                {k.value}
              </div>
              <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-400 leading-snug">
                {k.sub}
              </div>
            </div>
          ))}

          <LabourRateCard />
        </div>

        {/* 3. COMMAND CENTRE — 70/30 split on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT 70% — Recent quotes */}
          <section className="lg:col-span-8 rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="font-display uppercase text-lg sm:text-xl tracking-tight text-white">
                Recent AI Quotes &amp; Estimations
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

            {/* Desktop: full data table */}
            <div className="hidden lg:block overflow-x-auto">
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
                        <StatusTag status={q.status} />
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

            {/* Mobile/Tablet: quote cards */}
            <div className="lg:hidden space-y-3" data-testid="quotes-cards">
              {filtered.map((q, i) => (
                <QuoteCard key={i} q={q} index={i} />
              ))}
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-neutral-500">
                  No quotes match "{query}".
                </div>
              )}
            </div>
          </section>

          {/* RIGHT 30% — Sticky action panel (desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="font-display uppercase text-lg sm:text-xl tracking-tight text-white mb-5">
              Quick Actions &amp; Workflows
            </h2>

            {/* Primary CTA shown here on desktop only (mobile has the top button) */}
            <button
              type="button"
              onClick={() => navigate("/quote")}
              data-testid="action-new-quote"
              className="hidden lg:inline-flex w-full items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-black uppercase tracking-[0.16em] text-sm border-2 border-black btn-industrial"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Start a New Quote
            </button>

            <div className="lg:mt-4 space-y-3">
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

function StatusTag({ status }) {
  return (
    <span
      className={`inline-block border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
        STATUS_STYLES[status] || STATUS_STYLES.Draft
      }`}
    >
      {status}
    </span>
  );
}

function QuoteCard({ q, index }) {
  return (
    <div
      data-testid={`quote-card-${index}`}
      className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-4 active:bg-zinc-900 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display uppercase text-sm tracking-tight text-white truncate">
          {q.client}
        </span>
        <StatusTag status={q.status} />
      </div>
      <p className="mt-2 text-sm text-neutral-400 line-clamp-2">{q.scope}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          {q.date}
        </span>
        <span className="font-mono text-base font-semibold text-yellow-500 text-right">
          {q.total}
        </span>
      </div>
    </div>
  );
}

function LabourRateCard() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const rate = user?.hourly_rate;

  const startEdit = () => {
    setValue(rate != null ? String(rate) : "");
    setEditing(true);
  };

  const save = async () => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      toast.error("Enter a valid hourly rate.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ hourly_rate: num });
      toast.success("Labour rate saved. The estimator will factor it in.");
      setEditing(false);
    } catch {
      toast.error("Couldn't save rate. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-testid="kpi-labour-rate"
      className="group relative rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-4 sm:p-6 hover:bg-zinc-900 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 leading-tight">
          Labour Rate
        </span>
        <Clock
          className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-yellow-500 group-hover:text-yellow-400 transition-colors"
          strokeWidth={1.8}
        />
      </div>

      {editing ? (
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl sm:text-3xl font-black text-yellow-500">$</span>
            <Input
              data-testid="labour-rate-input"
              type="number"
              min="0"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="95"
              className="h-10 w-20 sm:w-24 rounded-none bg-neutral-950 border-neutral-800 text-white text-base sm:text-lg font-mono focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
            <button
              type="button"
              data-testid="labour-rate-save"
              onClick={save}
              disabled={saving}
              className="h-10 w-10 grid place-items-center bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
          <div className="mt-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            AUD per hour (ex GST)
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 sm:mt-4 flex items-baseline gap-1">
            <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
              {rate != null ? `$${rate}` : "—"}
            </span>
            {rate != null && <span className="font-mono text-xs sm:text-sm text-neutral-500">/hr</span>}
          </div>
          <button
            type="button"
            data-testid="labour-rate-edit"
            onClick={startEdit}
            className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            {rate != null ? "Edit rate" : "Set your rate"}
          </button>
        </>
      )}
    </div>
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
