import "./MobileDashboard.bedrock.css";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, ArrowRight, ShieldAlert, Sparkles, Phone, Send, Clock, LogOut } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import SwipeReveal from "@/components/SwipeReveal";
import { ActivityRowSkeleton, StatSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/context/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const fmtMoney = (n) => `$${Number(n || 0).toLocaleString("en-AU")}`;
const STATUS_TAG = { Sent: "tag-amber", Won: "tag-green", Lost: "tag-red", Draft: "tag-mute" };

function relTime(ts) {
  const d = ts ? new Date(ts).getTime() : 0;
  if (!d) return "";
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24); if (dd === 1) return "Yesterday";
  if (dd < 7) return `${dd} days ago`;
  const w = Math.floor(dd / 7); if (w < 5) return `${w}w ago`;
  return new Date(ts).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
function daysSince(ts) {
  const d = ts ? new Date(ts).getTime() : 0;
  return d ? Math.max(0, Math.floor((Date.now() - d) / 86400000)) : 0;
}
function jobLabel(q) {
  const items = Array.isArray(q.items) ? q.items.map((i) => i.label).filter(Boolean) : [];
  return items.length ? items.join(", ") : "Quote";
}
function quoteNo(q) {
  const id = q.quote_number || q.id || q._id;
  if (!id) return "";
  return q.quote_number ? String(q.quote_number) : `#${String(id).slice(-4)}`;
}
function initials(name) {
  return (name || "—").split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

/* ---------- Stat tile ---------- */
function StatTile({ label, accent, testid, isMoney, raw, large }) {
  return (
    <div className={`bedrock-card-elev ${large ? "p-4" : "px-3.5 py-3"} flex flex-col gap-1.5`} data-testid={testid}>
      <div className="text-[10.5px] tracking-[0.16em] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-mono font-semibold leading-none ${large ? "text-[28px]" : "text-[22px]"}`} style={{ color: accent || "var(--text)" }}>
          <CountUp value={raw} prefix={isMoney ? "$" : ""} />
        </span>
      </div>
    </div>
  );
}

/* ---------- Recent activity row ---------- */
function ActivityCard({ item }) {
  const tag = STATUS_TAG[item.status] || "tag-mute";
  return (
    <div data-testid={`activity-${item.id}`} className="bedrock-card hover-lift w-full text-left p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-strong)" }}>
        <span className="font-display font-bold text-[13px]" style={{ color: "var(--gold-bright)" }}>{initials(item.client)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-oswald text-[14.5px] font-semibold truncate min-w-0">{item.client}</span>
          <span className="font-mono text-[10.5px] shrink-0" style={{ color: "var(--text-muted)" }}>{item.when}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5 min-w-0">
          <span className="text-[12px] truncate min-w-0" style={{ color: "var(--text-muted)" }}>
            {[item.quoteNo, item.job].filter(Boolean).join(" · ")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="font-mono font-semibold text-[15px]" style={{ color: "var(--gold-bright)" }}>{fmtMoney(item.amount)}</span>
          <span className={`tag-pill ${tag}`}>{item.status}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Follow-up row ---------- */
function FollowupRow({ item }) {
  const riskTag = item.risk === "high" ? "tag-red" : "tag-amber";
  const ageColor = item.age >= 7 ? "var(--red)" : "var(--amber)";
  return (
    <div className="bedrock-card hover-lift p-4" data-testid={`followup-${item.id}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {item.quoteNo && (
            <span className="font-mono font-semibold text-[11.5px] shrink-0" style={{ color: "var(--gold-bright)" }}>{item.quoteNo}</span>
          )}
          <span className={`tag-pill ${riskTag} shrink-0`}>{item.risk.toUpperCase()} RISK</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Clock size={11} style={{ color: ageColor }} />
          <span className="font-mono text-[10.5px] font-semibold" style={{ color: ageColor }}>{item.age}d</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
        <span className="font-display font-semibold text-[14.5px] truncate min-w-0">{item.client}</span>
        <span className="font-mono font-semibold text-[15px] shrink-0" style={{ color: "var(--gold-bright)" }}>{fmtMoney(item.amount)}</span>
      </div>
      <div className="text-[12px] mb-3 truncate" style={{ color: "var(--text-muted)" }}>{item.job}</div>
      <div className="flex gap-2">
        <button className="ghost-btn flex-1 rounded-lg py-2 text-[12px] font-semibold flex items-center justify-center gap-1.5"><Phone size={12} /> Call</button>
        <button className="gold-btn flex-1 rounded-lg py-2 text-[12px] font-semibold flex items-center justify-center gap-1.5"><Send size={12} /> Nudge</button>
      </div>
    </div>
  );
}

export default function MobileDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quotes, setQuotes] = useState(null); // null = loading
  const [tab, setTab] = useState("activity");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/quotes`)
      .then(({ data }) => { if (!cancelled) setQuotes(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setQuotes([]); });
    return () => { cancelled = true; };
  }, []);

  const loading = quotes === null;
  const list = quotes || [];

  const snapshot = useMemo(() => {
    const won = list.filter((q) => q.status === "Won");
    return {
      revenue: won.reduce((s, q) => s + (q.total_low || 0), 0),
      jobsWon: won.length,
      quotesSent: list.filter((q) => q.status && q.status !== "Draft").length,
      awaiting: list.filter((q) => q.status === "Sent").length,
    };
  }, [quotes]); // eslint-disable-line react-hooks/exhaustive-deps

  const recentActivity = useMemo(() => {
    const sorted = [...list].sort(
      (a, b) => new Date(b.updated_at || b.generated_at || 0) - new Date(a.updated_at || a.generated_at || 0)
    );
    const q = query.trim().toLowerCase();
    const filtered = q
      ? sorted.filter((x) => `${x.client?.name || ""} ${jobLabel(x)}`.toLowerCase().includes(q))
      : sorted;
    return filtered.slice(0, 6).map((x) => ({
      id: x.id || x._id,
      client: x.client?.name || "Unnamed client",
      quoteNo: quoteNo(x),
      amount: x.total_low || 0,
      status: x.status || "Draft",
      when: relTime(x.updated_at || x.generated_at),
      job: jobLabel(x),
    }));
  }, [quotes, query]); // eslint-disable-line react-hooks/exhaustive-deps

  const followups = useMemo(() => {
    return list
      .filter((q) => q.status === "Sent")
      .map((x) => {
        const age = daysSince(x.generated_at || x.updated_at);
        return {
          id: x.id || x._id,
          client: x.client?.name || "Unnamed client",
          quoteNo: quoteNo(x),
          amount: x.total_low || 0,
          age,
          risk: age >= 7 ? "high" : "medium",
          job: jobLabel(x),
        };
      })
      .sort((a, b) => b.age - a.age);
  }, [quotes]); // eslint-disable-line react-hooks/exhaustive-deps

  const businessName = user?.business_name || "Your business";
  const displayName = user?.name || "—";

  return (
    <div className="px-6 pt-3 pb-6" data-testid="dashboard-page">
      {/* HEADER */}
      <div className="tp-topbar reveal reveal-1">
        <div className="tp-page-brand" data-testid="terrainpro-brand">
          <span className="brand-primary">TERRAIN</span>
          <span className="brand-secondary">PRO</span>
        </div>
        <div className="tp-top-actions" aria-label="Account controls">
          <button
            type="button"
            className="tp-top-action"
            aria-label="Log out"
            title="Log out"
            data-testid="top-logout"
            onClick={() => { logout(); navigate("/login"); }}
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      <header className="tp-auto-header reveal reveal-1" data-testid="terrainpro-console-header">
        <div className="tp-console-display-grid">
          <div className="tp-heading-block">
            <h1 className="console-title-primary">{displayName}</h1>
          </div>
          <div className="tp-location-telemetry">
            <div className="location-badge-wrap">
              <span className="location-main-text">{businessName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <div className="relative mb-5 mt-5 reveal reveal-2" data-testid="search-wrap">
        <Search className="lucide absolute left-4 top-1/2 -translate-y-1/2" size={17} style={{ color: "var(--text-muted)" }} />
        <input
          data-testid="search-input"
          className="input-field pl-11"
          placeholder="Search clients, quotes or jobs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* BUSINESS SNAPSHOT — from real quotes */}
      <section className="mb-4 reveal reveal-3" data-testid="snapshot-section">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-oswald font-extrabold text-[18px]" style={{ color: "var(--text)", letterSpacing: "0.015em" }}>
            Business Snapshot
          </h2>
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: "var(--text-muted)" }}>All time</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {loading ? (
            <><StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
          ) : (
            <>
              <StatTile large label="Revenue" raw={snapshot.revenue} isMoney accent="var(--gold-bright)" testid="stat-revenue" />
              <StatTile large label="Jobs Won" raw={snapshot.jobsWon} accent="var(--green)" testid="stat-jobs-won" />
              <StatTile label="Quotes Sent" raw={snapshot.quotesSent} testid="stat-quotes-sent" />
              <StatTile label="Awaiting" raw={snapshot.awaiting} accent="var(--amber)" testid="stat-awaiting" />
            </>
          )}
        </div>
      </section>

      {/* SUBGRADE AI — links to the quote builder (no fabricated figure) */}
      <button
        onClick={() => navigate("/quote")}
        data-testid="subgrade-banner"
        className="reveal reveal-4 w-full text-left mb-7 rounded-2xl overflow-hidden hover-lift-gold"
        style={{
          background: "linear-gradient(90deg, rgba(240,185,11,0.10) 0%, rgba(240,185,11,0.04) 60%, rgba(0,0,0,0.20) 100%)",
          border: "1px solid rgba(252,213,53,0.30)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02), 0 0 20px -8px rgba(240,185,11,0.30)",
        }}
      >
        <div className="flex items-center gap-3.5 p-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative"
            style={{ background: "linear-gradient(180deg, rgba(252,213,53,0.25), rgba(240,185,11,0.10))", border: "1px solid rgba(252,213,53,0.40)" }}
          >
            <ShieldAlert size={19} style={{ color: "var(--gold-bright)" }} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full pulse-dot" style={{ background: "var(--red)", boxShadow: "0 0 6px var(--red)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9.5px] font-mono tracking-[0.20em] uppercase font-bold" style={{ color: "var(--gold-bright)" }}>SUBGRADE&nbsp;AI</span>
              <Sparkles size={10} style={{ color: "var(--gold-bright)" }} />
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Scan a quote for hidden costs</span>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: "var(--gold-bright)" }} className="shrink-0" />
        </div>
      </button>

      {/* TABS — Recent Activity / Follow-up */}
      <section className="reveal reveal-5" data-testid="lower-tabs-section">
        <div className="flex items-center justify-between mb-3">
          <div className="bedrock-segmented" style={{ flex: "0 1 auto" }} data-testid="dash-tabs">
            <button type="button" onClick={() => setTab("activity")} className={`bedrock-segment ${tab === "activity" ? "active" : ""}`} data-testid="tab-activity">
              Recent Activity
            </button>
            <button type="button" onClick={() => setTab("followup")} className={`bedrock-segment ${tab === "followup" ? "active" : ""}`} data-testid="tab-followup">
              <span className="flex items-center gap-1.5">
                Follow-up
                <span
                  className="font-mono font-bold text-[9.5px] px-1.5 py-0.5 rounded-full"
                  style={{ background: tab === "followup" ? "rgba(0,0,0,0.15)" : "rgba(246,70,93,0.18)", color: tab === "followup" ? "#0A0A0B" : "var(--red)" }}
                >
                  {followups.length}
                </span>
              </span>
            </button>
          </div>
        </div>

        {tab === "activity" && (
          <div className="space-y-2.5" data-testid="activity-list">
            {loading ? (
              <><ActivityRowSkeleton /><ActivityRowSkeleton /><ActivityRowSkeleton /></>
            ) : recentActivity.length === 0 ? (
              <div className="bedrock-card p-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
                No quotes yet — create one to see it here.
              </div>
            ) : (
              recentActivity.map((item) => (
                <SwipeReveal
                  key={item.id}
                  testid={`activity-swipe-${item.id}`}
                  actions={
                    <>
                      <button className="swipe-action-btn gold" data-testid={`activity-call-${item.id}`} onClick={(e) => e.stopPropagation()}>
                        <Phone size={16} /><span>Call</span>
                      </button>
                      <button className="swipe-action-btn amber" data-testid={`activity-followup-${item.id}`} onClick={(e) => e.stopPropagation()}>
                        <Send size={16} /><span>Nudge</span>
                      </button>
                    </>
                  }
                >
                  <ActivityCard item={item} />
                </SwipeReveal>
              ))
            )}
          </div>
        )}

        {tab === "followup" && (
          <div className="space-y-2.5" data-testid="followup-list">
            {loading ? (
              <><ActivityRowSkeleton /><ActivityRowSkeleton /></>
            ) : followups.length === 0 ? (
              <div className="bedrock-card p-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
                Nothing awaiting follow-up.
              </div>
            ) : (
              followups.map((item) => <FollowupRow key={item.id} item={item} />)
            )}
          </div>
        )}
      </section>
    </div>
  );
}
