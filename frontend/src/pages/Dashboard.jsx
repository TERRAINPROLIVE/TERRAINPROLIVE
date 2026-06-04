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
  X,
  Download,
  RotateCcw,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { generateQuotePdf } from "@/lib/quotePdf";
import { JOB_LOOKUP } from "@/lib/jobCatalog";

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
  const [selected, setSelected] = useState(null);

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
          raw: q,
        }));
        setQuotes(mapped);
      })
      .catch(() => setQuotes([]));
    return () => {
      active = false;
    };
  }, []);

  const rows = quotes || [];
  const filtered = rows.filter((q) =>
    `${q.client} ${q.scope} ${q.status}`.toLowerCase().includes(query.toLowerCase())
  );
  const emptyMsg = query
    ? `No quotes match "${query}".`
    : "No saved quotes yet — generate one from the estimator.";

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
              className="hidden lg:block lg:col-span-2 lg:col-start-3 lg:mt-14 relative rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 px-5 py-4"
            >
              <BusinessMetaEditable />
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
                  {user?.business_name || BUSINESS.name}
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
                className="relative mt-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-4"
              >
                <BusinessMetaEditable />
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
                      onClick={() => q.raw && setSelected(q.raw)}
                      className={`border-b border-zinc-800/60 hover:bg-zinc-900 transition-colors ${
                        q.raw ? "cursor-pointer" : ""
                      }`}
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
                        {emptyMsg}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet: quote cards */}
            <div className="lg:hidden space-y-3" data-testid="quotes-cards">
              {filtered.map((q, i) => (
                <QuoteCard key={i} q={q} index={i} onOpen={() => q.raw && setSelected(q.raw)} />
              ))}
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-neutral-500">
                  {emptyMsg}
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

      {selected && (
        <SavedQuoteDetail
          doc={selected}
          onClose={() => setSelected(null)}
          onReopen={() => navigate("/quote")}
        />
      )}
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

function SavedQuoteDetail({ doc, onClose, onReopen }) {
  const { user } = useAuth();
  const q = doc.quote || {};
  const items = q.line_items || [];
  const cust = doc.customer || {};

  // Group line items by scope
  const groups = {};
  items.forEach((li) => {
    const k = li.scope || "general";
    (groups[k] = groups[k] || []).push(li);
  });
  const groupIds = Object.keys(groups);

  const dateStr = doc.created_at
    ? new Date(doc.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
    : "";

  const exportPdf = () => {
    try {
      generateQuotePdf({
        quote: q,
        customer: {
          full_name: cust.full_name || doc.client,
          address: cust.address || "",
        },
        selectedJobs: groupIds.map((id) => JOB_LOOKUP[id]).filter(Boolean),
        business: {
          name: user?.business_name || (user?.name ? `${user.name}'s Quote` : "TerrainPRO"),
          abn: user?.abn ? `ABN ${user.abn}` : "",
        },
      });
      toast.success("PDF downloaded.");
    } catch {
      toast.error("Couldn't generate the PDF.");
    }
  };

  return (
    <div
      data-testid="quote-detail-modal"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="quote-detail-backdrop"
      />
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-xl sm:rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-950">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-5 sm:px-6 py-4">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500">
              Saved Quote · {dateStr}
            </div>
            <h2 className="mt-1 font-display uppercase text-xl sm:text-2xl tracking-tight text-white truncate">
              {doc.client || "Customer"}
            </h2>
            <div className="mt-2">
              <StatusTag status={doc.status || "Draft"} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="quote-detail-close"
            aria-label="Close"
            className="shrink-0 h-9 w-9 grid place-items-center border border-zinc-800 text-neutral-400 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-6">
          {/* Total range */}
          <div className="flex items-center justify-between gap-4 bg-yellow-500 text-black px-4 py-3">
            <span className="font-black uppercase tracking-[0.16em] text-xs">Total Range (incl. GST)</span>
            <span className="font-mono font-bold text-base sm:text-lg">
              {fmtMoney(doc.total_low)} — {fmtMoney(doc.total_high)}
            </span>
          </div>

          {/* Scope summary */}
          {q.summary && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
                Scope Summary
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{q.summary}</p>
            </div>
          )}

          {/* Line items grouped */}
          {groupIds.map((scopeId) => {
            const job = JOB_LOOKUP[scopeId];
            return (
              <div key={scopeId}>
                <div className="font-display uppercase text-sm tracking-tight text-yellow-500 mb-2 border-b border-zinc-800 pb-2">
                  {job ? job.label : scopeId.replace(/_/g, " ")}
                </div>
                <div className="space-y-2">
                  {groups[scopeId].map((li, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 text-sm">
                      <div className="min-w-0">
                        <div className="text-neutral-200">{li.label}</div>
                        {li.detail && (
                          <div className="text-xs text-neutral-500 mt-0.5">{li.detail}</div>
                        )}
                        {(li.qty != null || li.unit) && (
                          <div className="font-mono text-[11px] text-neutral-500 mt-0.5">
                            {li.qty} {li.unit} {li.unit_cost != null ? `@ ${fmtMoney(li.unit_cost)}` : ""}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 font-mono text-sm text-yellow-500 text-right">
                        {fmtMoney(li.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Totals breakdown */}
          <div className="border-t border-zinc-800 pt-4 space-y-1.5">
            <TotalRow label="Labour" value={q.labor_total} />
            <TotalRow label="Materials" value={q.materials_total} />
            <TotalRow label="Contingency" value={q.contingency_total} />
            <TotalRow label="GST" value={q.gst} />
          </div>

          {/* Assumptions */}
          {Array.isArray(q.assumptions) && q.assumptions.length > 0 && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
                Assumptions
              </div>
              <ul className="space-y-1.5">
                {q.assumptions.map((a, idx) => (
                  <li key={idx} className="text-xs text-neutral-400 leading-relaxed flex gap-2">
                    <span className="text-yellow-500">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 flex items-center gap-3 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 px-5 sm:px-6 py-4">
          <button
            type="button"
            onClick={exportPdf}
            data-testid="quote-detail-export"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-yellow-500 text-black font-black uppercase tracking-[0.16em] text-xs hover:bg-yellow-400 transition-colors"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Export PDF
          </button>
          <button
            type="button"
            onClick={onReopen}
            data-testid="quote-detail-reopen"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 border border-zinc-700 text-neutral-300 font-bold uppercase tracking-[0.16em] text-xs hover:border-yellow-500 hover:text-yellow-500 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-mono text-neutral-200">{fmtMoney(value)}</span>
    </div>
  );
}

function QuoteCard({ q, index, onOpen }) {
  return (
    <div
      data-testid={`quote-card-${index}`}
      onClick={onOpen}
      className={`rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-4 active:bg-zinc-900 transition-colors ${
        q.raw ? "cursor-pointer" : ""
      }`}
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

function BusinessMetaEditable() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [abn, setAbn] = useState("");
  const [saving, setSaving] = useState(false);

  const bizName = user?.business_name || BUSINESS.name;
  const abnDisplay = user?.abn ? `ABN ${user.abn}` : "Not set";

  const startEdit = () => {
    setName(user?.business_name || "");
    setAbn(user?.abn || "");
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ business_name: name.trim(), abn: abn.trim() });
      toast.success("Business details saved — they'll appear on exported quote PDFs.");
      setEditing(false);
    } catch {
      toast.error("Couldn't save business details. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="space-y-3" data-testid="business-meta-edit">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 mb-1.5">
            Business Name
          </div>
          <Input
            data-testid="business-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apex Landscaping"
            className="h-9 rounded-none bg-neutral-950 border-neutral-800 text-white text-sm focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
          />
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 mb-1.5">
            ABN
          </div>
          <Input
            data-testid="business-abn-input"
            value={abn}
            onChange={(e) => setAbn(e.target.value)}
            placeholder="12 345 678 910"
            inputMode="numeric"
            className="h-9 rounded-none bg-neutral-950 border-neutral-800 text-white text-sm font-mono focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            data-testid="business-meta-save"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-yellow-500 text-black font-black uppercase tracking-[0.16em] text-[11px] hover:bg-yellow-400 disabled:opacity-50 transition-colors"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            Save
          </button>
          <button
            type="button"
            data-testid="business-meta-cancel"
            onClick={() => setEditing(false)}
            className="h-9 px-3 text-neutral-400 hover:text-white font-mono text-[11px] uppercase tracking-[0.16em] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        data-testid="business-meta-edit-btn"
        onClick={startEdit}
        aria-label="Edit business details"
        className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 text-yellow-500 hover:text-yellow-400 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 pr-6">
        <Meta label="Business" value={bizName} />
        <Meta label="Location" value={BUSINESS.location} />
        <Meta label="Registration" value={abnDisplay} />
        <Meta label="Crew Size" value={BUSINESS.size} />
      </div>
    </>
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
