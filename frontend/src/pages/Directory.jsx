import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  BadgeCheck,
  ArrowRight,
  Plus,
  X,
  Briefcase,
} from "lucide-react";
import AppShell from "@/components/AppShell";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TRADE_META = {
  excavation: { label: "Excavation", badge: "bg-amber-500/10 text-amber-300 ring-amber-500/20" },
  concreting: { label: "Concreting", badge: "bg-zinc-400/10 text-zinc-200 ring-zinc-400/20" },
  landscaping: { label: "Landscaping", badge: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20" },
  plumbing: { label: "Plumbing", badge: "bg-sky-500/10 text-sky-300 ring-sky-500/20" },
  electrical: { label: "Electrical", badge: "bg-yellow-500/10 text-yellow-300 ring-yellow-500/20" },
  carpentry: { label: "Carpentry", badge: "bg-orange-500/10 text-orange-300 ring-orange-500/20" },
  fencing: { label: "Fencing", badge: "bg-lime-500/10 text-lime-300 ring-lime-500/20" },
  paving: { label: "Paving", badge: "bg-stone-400/10 text-stone-200 ring-stone-400/20" },
  arborist: { label: "Arborist", badge: "bg-green-500/10 text-green-300 ring-green-500/20" },
  plant_hire: { label: "Plant Hire", badge: "bg-rose-500/10 text-rose-300 ring-rose-500/20" },
};

const FILTERS = [{ key: "all", label: "All Trades" }].concat(
  Object.entries(TRADE_META).map(([key, m]) => ({ key, label: m.label }))
);

export default function Directory() {
  const [pros, setPros] = useState(null);
  const [trade, setTrade] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API}/directory`)
      .then(({ data }) => active && setPros(data || []))
      .catch(() => active && setPros([]));
    return () => {
      active = false;
    };
  }, []);

  const list = pros || [];
  const filtered = list.filter((p) => {
    const matchTrade = trade === "all" || p.trade === trade;
    const hay = `${p.business_name} ${p.service_area} ${p.blurb}`.toLowerCase();
    return matchTrade && hay.includes(query.toLowerCase());
  });
  const verifiedCount = list.filter((p) => p.verified).length;

  return (
    <AppShell>
      <main
        data-testid="directory-page"
        className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 pt-4 sm:pt-5 pb-24 sm:pb-16"
      >
        {/* Header */}
        <div className="mb-7 sm:mb-9">
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-yellow-500">
            TerrainPRO // Trade Network
          </div>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display uppercase text-3xl sm:text-5xl tracking-tight leading-none">
                Preferred <span className="text-yellow-500">Pro's</span>
              </h1>
              <p className="mt-3 text-sm text-neutral-400 max-w-xl leading-relaxed">
                Vetted businesses on TerrainPRO that do quality work. Need a chippy, an
                excavator or a sparky? Refer with confidence.
              </p>
            </div>
            <button
              type="button"
              data-testid="directory-list-business"
              onClick={() =>
                toast.success("Request noted — we'll be in touch about listing your business.")
              }
              className="shrink-0 inline-flex items-center justify-center gap-2 h-12 px-5 border-2 border-yellow-500 text-yellow-500 font-black uppercase tracking-[0.16em] text-xs hover:bg-yellow-500 hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              List My Business
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            <span>{list.length} pros</span>
            <span className="inline-flex items-center gap-1.5 text-yellow-500/80">
              <BadgeCheck className="w-3.5 h-3.5" /> {verifiedCount} verified members
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            data-testid="directory-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, trade or suburb…"
            className="w-full h-12 rounded-lg bg-zinc-900/60 ring-1 ring-white/5 focus:ring-yellow-500/40 text-white text-sm pl-11 pr-4 focus:outline-none transition-all"
          />
        </div>

        {/* Trade filter chips */}
        <div className="flex flex-wrap gap-2 mb-7">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              data-testid={`directory-filter-${f.key}`}
              onClick={() => setTrade(f.key)}
              className={`px-3.5 h-9 rounded-full font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                trade === f.key
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-900/60 text-neutral-400 ring-1 ring-white/5 hover:text-white hover:ring-white/15"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {pros === null ? (
          <div className="py-20 text-center font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
            Loading directory…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-neutral-500">
            No pros match your filters yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p) => (
              <ProCard key={p.id} pro={p} onView={() => setSelected(p)} />
            ))}
          </div>
        )}
      </main>

      {selected && <ProfileModal pro={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function VerifiedPill({ full = false }) {
  return (
    <span
      data-testid="verified-badge"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 ring-1 ring-yellow-500/25 text-yellow-400 font-mono text-[9px] uppercase tracking-[0.15em] whitespace-nowrap"
    >
      <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.2} />
      {full ? "Verified TerrainPRO Member" : "Verified"}
    </span>
  );
}

function TradeBadge({ trade }) {
  const meta = TRADE_META[trade] || { label: trade, badge: "bg-white/5 text-neutral-300 ring-white/10" };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md ring-1 font-mono text-[10px] uppercase tracking-[0.18em] ${meta.badge}`}>
      {meta.label}
    </span>
  );
}

function ProCard({ pro, onView }) {
  return (
    <div
      data-testid={`pro-card-${pro.id}`}
      className="group flex flex-col rounded-xl bg-zinc-900/50 ring-1 ring-white/5 hover:ring-yellow-500/30 hover:bg-zinc-900 transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display uppercase text-lg tracking-tight text-white leading-tight">
            {pro.business_name}
          </h3>
          <div className="mt-2">
            <TradeBadge trade={pro.trade} />
          </div>
        </div>
        {pro.verified && <VerifiedPill />}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
        <MapPin className="w-4 h-4 text-yellow-500/80 shrink-0" strokeWidth={1.8} />
        <span className="truncate">{pro.service_area}</span>
      </div>

      <p className="mt-3 text-sm text-neutral-400 leading-relaxed line-clamp-2 flex-1">
        {pro.blurb}
      </p>

      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <a
            href={`tel:${pro.phone}`}
            data-testid={`pro-call-${pro.id}`}
            aria-label={`Call ${pro.business_name}`}
            className="h-9 w-9 grid place-items-center rounded-lg text-neutral-400 hover:text-yellow-500 hover:bg-white/5 transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={1.8} />
          </a>
          <a
            href={`mailto:${pro.email}`}
            data-testid={`pro-email-${pro.id}`}
            aria-label={`Email ${pro.business_name}`}
            className="h-9 w-9 grid place-items-center rounded-lg text-neutral-400 hover:text-yellow-500 hover:bg-white/5 transition-colors"
          >
            <Mail className="w-4 h-4" strokeWidth={1.8} />
          </a>
        </div>
        <button
          type="button"
          onClick={onView}
          data-testid={`pro-view-${pro.id}`}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-300 hover:text-yellow-500 transition-colors"
        >
          View Profile <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ProfileModal({ pro, onClose }) {
  return (
    <div
      data-testid="pro-profile-modal"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-zinc-950 ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-white/5">
          <div className="min-w-0">
            <TradeBadge trade={pro.trade} />
            <h2 className="mt-3 font-display uppercase text-2xl tracking-tight text-white">
              {pro.business_name}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
              <MapPin className="w-4 h-4 text-yellow-500/80 shrink-0" strokeWidth={1.8} />
              {pro.service_area}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="pro-profile-close"
            aria-label="Close"
            className="shrink-0 h-9 w-9 grid place-items-center rounded-lg ring-1 ring-white/10 text-neutral-400 hover:text-yellow-500 hover:ring-yellow-500/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {pro.verified && <VerifiedPill full />}

          <p className="text-sm text-neutral-300 leading-relaxed">{pro.blurb}</p>

          {pro.years != null && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Briefcase className="w-4 h-4 text-yellow-500/80" strokeWidth={1.8} />
              {pro.years}+ years in the trade
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 pt-2">
            <a
              href={`tel:${pro.phone}`}
              className="flex items-center gap-3 h-12 px-4 rounded-lg bg-zinc-900/60 ring-1 ring-white/5 text-neutral-200 hover:ring-yellow-500/30 transition-colors"
            >
              <Phone className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
              <span className="font-mono text-sm">{pro.phone}</span>
            </a>
            <a
              href={`mailto:${pro.email}`}
              className="flex items-center gap-3 h-12 px-4 rounded-lg bg-zinc-900/60 ring-1 ring-white/5 text-neutral-200 hover:ring-yellow-500/30 transition-colors"
            >
              <Mail className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
              <span className="font-mono text-sm truncate">{pro.email}</span>
            </a>
            {pro.website && (
              <a
                href={`https://${pro.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 h-12 px-4 rounded-lg bg-zinc-900/60 ring-1 ring-white/5 text-neutral-200 hover:ring-yellow-500/30 transition-colors"
              >
                <Globe className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
                <span className="font-mono text-sm truncate">{pro.website}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
