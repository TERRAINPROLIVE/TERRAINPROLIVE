import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Camera,
  UserPlus,
  Clock,
  LayoutDashboard,
  Menu,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { generateQuotePdf } from "@/lib/quotePdf";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtMoney = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 })
    : "—";

const STATUS_STYLES = {
  Draft: "text-yellow-500",
  Sent: "text-blue-300",
  Won: "text-green-300",
  Lost: "text-red-300",
};

export default function MobileDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/quotes`)
      .then(({ data }) => {
        if (!cancelled) setQuotes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setQuotes([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // KPI calc from real data
  const kpis = useMemo(() => {
    const list = quotes || [];
    const active = list.filter((q) => q.status === "Draft" || q.status === "Sent");
    const won = list.filter((q) => q.status === "Won");
    const pendingTotal = active.reduce((sum, q) => sum + (q.total_low || 0), 0);
    const decided = won.length + list.filter((q) => q.status === "Lost").length;
    const conversion = decided > 0 ? Math.round((won.length / decided) * 100) : 0;
    return {
      active: active.length,
      won: won.length,
      pending: pendingTotal,
      conversion,
    };
  }, [quotes]);

  const pipeline = useMemo(() => {
    const list = quotes || [];
    const by = (s) => list.filter((q) => q.status === s).length;
    return {
      Enquiries: 0, // no enquiry system yet
      Draft: by("Draft"),
      Sent: by("Sent"),
      Approval: 0, // no Awaiting Approval status
      Won: by("Won"),
    };
  }, [quotes]);

  const recentJobs = useMemo(() => {
    const list = quotes || [];
    const sorted = [...list].sort((a, b) => {
      const ad = new Date(a.updated_at || a.generated_at || 0).getTime();
      const bd = new Date(b.updated_at || b.generated_at || 0).getTime();
      return bd - ad;
    });
    const filtered = query
      ? sorted.filter((q) => {
          const blob = `${q.client?.name || ""} ${q.items?.map((i) => i.label).join(" ") || ""}`.toLowerCase();
          return blob.includes(query.toLowerCase());
        })
      : sorted;
    return filtered.slice(0, 4);
  }, [quotes, query]);

  const handlePdf = async (q) => {
    try {
      await generateQuotePdf(q, user);
      toast.success("PDF saved");
    } catch (e) {
      toast.error("Couldn't generate PDF");
    }
  };

  const businessName = user?.business_name || "Your Business";
  const firstName = user?.name?.split(" ")[0] || "Tradie";
  const initials = (user?.name || "T")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const labourRate = user?.hourly_rate ? `$${user.hourly_rate}` : "$—";

  return (
    <div data-testid="mobile-dashboard" className="lg:hidden bg-[#0a0a0a] text-white min-h-screen pb-24">
      {/* Header */}
      {/* Header — brand + profile (Bybit-style) */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-yellow-500 flex items-center justify-center rounded-lg shrink-0">
            <span className="font-black text-black text-[11px] tracking-tight">TP</span>
          </div>
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-base font-black text-white tracking-tight italic truncate">
              TERRAINPRO
            </span>
            <span className="text-sm text-neutral-500 font-medium shrink-0">Quotes</span>
          </div>
        </div>
        <button
          type="button"
          data-testid="mobile-avatar"
          onClick={() => setProfileOpen(true)}
          aria-label="Profile menu"
          aria-expanded={profileOpen}
          className="relative w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 grid place-items-center font-display uppercase text-xs font-bold tracking-tight text-yellow-500 shrink-0"
        >
          {initials}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0a0a0a]" />
        </button>
      </header>

      {/* Greeting + business (Bybit split card) */}
      <div className="px-4 pb-4">
        <div
          className="flex items-stretch bg-[#161616] rounded-2xl overflow-hidden"
          data-testid="mobile-greeting-card"
        >
          <div className="flex-1 min-w-0 px-4 py-4">
            <p className="text-sm text-neutral-500">G'day,</p>
            <p className="text-2xl font-black text-white tracking-tight truncate">{firstName}</p>
          </div>
          <div className="w-px bg-zinc-800/80 my-3 shrink-0" />
          <div className="flex-1 min-w-0 px-4 py-4 flex flex-col items-end justify-center text-right">
            <p className="text-base font-bold text-white truncate max-w-full">{businessName}</p>
            <span className="mt-1.5 inline-block bg-zinc-800/70 rounded-lg px-2.5 py-1 font-mono text-[11px] tracking-wider text-neutral-400 truncate max-w-full">
              {user?.abn ? `ABN ${user.abn}` : "ABN —"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile menu (opens from avatar) */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" data-testid="mobile-profile-overlay">
          <button
            type="button"
            aria-label="Close profile menu"
            onClick={() => setProfileOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute right-4 top-16 w-60 bg-[#161616] border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
              <span className="w-10 h-10 rounded-full bg-zinc-800 border border-yellow-500/40 grid place-items-center font-display uppercase text-sm font-bold text-yellow-500 shrink-0">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{firstName}</p>
                <p className="text-[11px] text-neutral-400 truncate">{businessName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                navigate("/directory");
              }}
              data-testid="mobile-profile-clients"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900 transition-colors"
            >
              <Users className="w-4 h-4 text-neutral-300" strokeWidth={1.8} />
              <span className="text-[13px] text-neutral-200">Clients</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                logout();
                navigate("/login");
              }}
              data-testid="mobile-profile-logout"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900 transition-colors border-t border-zinc-800"
            >
              <LogOut className="w-4 h-4 text-neutral-300" strokeWidth={1.8} />
              <span className="text-[13px] text-neutral-200">Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            data-testid="mobile-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quotes, clients, jobs…"
            className="w-full h-10 pl-10 pr-3 bg-zinc-900 border border-zinc-800 rounded-none text-[13px] text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 border-y border-zinc-800 mb-5">
        <KpiCell label="Active Quotes" value={kpis.active} />
        <KpiCell label="Jobs Won" value={kpis.won} />
        <KpiCell label="Pending" value={fmtMoney(kpis.pending)} />
        <KpiCell label="Conversion" value={`${kpis.conversion}%`} gold />
      </div>

      {/* Action Hub */}
      <section className="px-4 mb-6">
        <SectionLabel>Action Hub</SectionLabel>
        <button
          type="button"
          onClick={() => navigate("/quote")}
          data-testid="mobile-new-quote"
          className="w-full inline-flex items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-black uppercase tracking-widest text-sm rounded-none active:scale-[0.98] transition-transform mt-3"
        >
          <Plus className="w-5 h-5" strokeWidth={3.5} />
          Start New Quote
        </button>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            data-testid="mobile-upload-photos"
            onClick={() => toast.info("Site photo uploads — coming soon")}
            className="inline-flex items-center justify-center gap-2 h-11 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-neutral-300 font-bold uppercase tracking-[0.18em] text-[10px] rounded-none transition-colors"
          >
            <Camera className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
            Upload Site Photos
          </button>
          <button
            type="button"
            data-testid="mobile-create-client"
            onClick={() => navigate("/quote")}
            className="inline-flex items-center justify-center gap-2 h-11 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-neutral-300 font-bold uppercase tracking-[0.18em] text-[10px] rounded-none transition-colors"
          >
            <UserPlus className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
            Create Client
          </button>
        </div>
      </section>

      {/* Work Pipeline */}
      <section className="mb-6">
        <SectionLabel className="px-4">Work Pipeline</SectionLabel>
        <div className="mt-3 grid grid-cols-5 border-y border-zinc-800">
          <PipelineCell label="New Enquiries" count={pipeline.Enquiries} />
          <PipelineCell label="Draft Quotes" count={pipeline.Draft} active />
          <PipelineCell label="Sent Quotes" count={pipeline.Sent} />
          <PipelineCell label="Awaiting Approval" count={pipeline.Approval} />
          <PipelineCell label="Won Jobs" count={pipeline.Won} />
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="px-4 mb-6">
        <SectionLabel>Recent Jobs</SectionLabel>
        <div className="mt-3 space-y-3">
          {quotes === null ? (
            <div className="text-center text-xs text-neutral-500 py-10">Loading…</div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center text-xs text-neutral-500 py-10">
              No quotes yet — tap Start New Quote above.
            </div>
          ) : (
            recentJobs.map((q) => (
              <JobRow
                key={q.id}
                quote={q}
                onPdf={() => handlePdf(q)}
                onSend={() => toast.info("Email quote — coming soon")}
                onView={() => navigate("/dashboard")}
              />
            ))
          )}
        </div>
      </section>

      {/* Business Health */}
      <section className="px-4 pb-6">
        <SectionLabel>Business Health</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-px bg-zinc-800 rounded-none overflow-hidden">
          <HealthTile
            value={
              <span className="flex items-baseline gap-1">
                <span className="text-yellow-500">{labourRate}</span>
                <span className="text-neutral-500 text-xs">/hr</span>
              </span>
            }
            label="Labour Rate"
          />
          <HealthTile
            value={
              <span className="flex items-center gap-2">
                <span className="grid place-items-center w-6 h-6 rounded-none border-2 border-yellow-500">
                  <Clock className="w-3 h-3 text-yellow-500" strokeWidth={2.4} />
                </span>
                <span className="text-white">10 mins</span>
              </span>
            }
            label="Avg Quote Time"
          />
        </div>
      </section>
      {/* Bottom Tab Nav — Pipeline · New · Menu */}
      <nav
        className="fixed bottom-0 left-0 right-0 lg:hidden bg-black border-t border-zinc-800 h-16 grid grid-cols-3 z-40"
        data-testid="mobile-bottom-nav"
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          data-testid="mobile-tab-pipeline"
          aria-label="Pipeline"
          aria-current="page"
          className="flex flex-col items-center justify-center gap-1 border-t-2 border-t-transparent text-neutral-500 hover:text-yellow-500 transition-colors"
        >
          <LayoutDashboard className="w-6 h-6" strokeWidth={1.8} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold">Pipeline</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/quote")}
          data-testid="mobile-tab-new"
          aria-label="New quote"
          className="flex flex-col items-center justify-center gap-1 bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold">New</span>
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          data-testid="mobile-tab-menu"
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="flex flex-col items-center justify-center gap-1 border-t-2 border-t-transparent text-neutral-500 hover:text-yellow-500 transition-colors"
        >
          <Menu className="w-6 h-6" strokeWidth={1.8} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold">Menu</span>
        </button>
      </nav>

      {/* Menu sheet — slides up from the Menu tab */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" data-testid="mobile-menu-overlay">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t-2 border-t-yellow-500 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <span className="font-display uppercase text-base tracking-tight text-white">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate("/directory");
              }}
              data-testid="mobile-menu-clients"
              className="w-full flex items-center gap-3 px-5 py-4 border-b border-zinc-800 text-left hover:bg-zinc-900 transition-colors"
            >
              <Users className="w-5 h-5 text-yellow-500" strokeWidth={1.8} />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white">Clients</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
                navigate("/login");
              }}
              data-testid="mobile-menu-logout"
              className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-zinc-900 transition-colors"
            >
              <LogOut className="w-5 h-5 text-neutral-400" strokeWidth={1.8} />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-300">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, className = "" }) {
  return (
    <div
      className={`text-center font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500 ${className}`}
    >
      {children}
    </div>
  );
}

function KpiCell({ label, value, gold }) {
  return (
    <div className="py-3 px-1 flex flex-col items-center justify-center border-r border-zinc-800 last:border-r-0">
      <div
        className={`font-display font-bold tracking-tight leading-none text-lg sm:text-xl ${
          gold ? "text-yellow-500" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] font-bold text-neutral-500 text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

function PipelineCell({ label, count, active }) {
  return (
    <div
      className={`flex flex-col items-center justify-between py-2.5 px-1 border-r border-zinc-800 last:border-r-0 ${
        active ? "bg-zinc-900 border-b-2 border-b-yellow-500" : ""
      }`}
    >
      <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.1em] font-bold text-neutral-500 text-center leading-tight">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-bold text-yellow-500">{count}</div>
    </div>
  );
}

function JobRow({ quote, onPdf, onSend, onView }) {
  const clientName =
    quote.client?.name || quote.client_name || (typeof quote.client === "string" ? quote.client : null) || "Client";
  const scope = (quote.items || []).map((i) => i.label).slice(0, 3).join(", ") || "Quote";
  const amount = fmtMoney(quote.total_low);
  const status = quote.status || "Draft";

  // Buttons depend on status
  const buttons =
    status === "Draft"
      ? [
          { label: "Draft", primary: true, onClick: onView, testid: `mobile-job-draft-${quote.id}` },
          { label: "Send", onClick: onSend, testid: `mobile-job-send-${quote.id}` },
          { label: "PDF", onClick: onPdf, testid: `mobile-job-pdf-${quote.id}` },
        ]
      : [
          { label: "View", onClick: onView, testid: `mobile-job-view-${quote.id}` },
          { label: "PDF", onClick: onPdf, testid: `mobile-job-pdf-${quote.id}` },
        ];

  return (
    <div data-testid={`mobile-job-${quote.id}`} className="bg-zinc-900/60 rounded-none p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-white font-display uppercase tracking-tight font-bold text-lg leading-none">
          {clientName}
        </h3>
        <span className="text-white font-display font-bold text-lg leading-none">{amount}</span>
      </div>
      <p className="text-neutral-400 text-[11px] mb-3 truncate">{scope}</p>
      <div className="flex items-center justify-end gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.onClick}
            data-testid={btn.testid}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-none border transition-colors ${
              btn.primary
                ? "bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-400"
                : "bg-zinc-800 border-zinc-700 text-neutral-300 hover:bg-zinc-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RowAction() { return null; } // unused placeholder kept for export compatibility

function HealthTile({ value, label }) {
  return (
    <div className="bg-zinc-900 p-4">
      <div className="font-display text-2xl font-bold tracking-tight leading-none">{value}</div>
      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] font-bold text-neutral-500">
        {label}
      </div>
    </div>
  );
}
