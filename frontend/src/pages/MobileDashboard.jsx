import "./MobileDashboard.bedrock.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, ShieldAlert, Sparkles, Phone, Send, Clock, Settings, LogOut } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import SwipeReveal from "@/components/SwipeReveal";
import { ActivityRowSkeleton, StatSkeleton } from "@/components/Skeleton";
import { USER, SNAPSHOT, RECENT_ACTIVITY, FOLLOWUPS, MARGIN_AT_RISK } from "@/data/mockData";
import { useSavedQuotes } from "@/lib/quoteStore";

const fmtMoney = (n) => `$${n.toLocaleString("en-AU")}`;

/* ---------- Stat tile (Hero metrics) ---------- */
function StatTile({ label, value, accent, delta, testid, isMoney, raw, large }) {
  return (
    <div className={`bedrock-card-elev ${large ? "p-4" : "px-3.5 py-3"} flex flex-col gap-1.5`} data-testid={testid}>
      <div className="text-[10.5px] tracking-[0.16em] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-mono font-semibold leading-none ${large ? "text-[28px]" : "text-[22px]"}`}
          style={{ color: accent || "var(--text)" }}
        >
          {raw !== undefined ? (
            <CountUp value={raw} prefix={isMoney ? "$" : ""} />
          ) : (
            value
          )}
        </span>
        {delta && (
          <span className="text-[10.5px] font-mono font-semibold" style={{ color: "var(--green)" }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- Recent activity row ---------- */
function ActivityCard({ item }) {
  const statusTag = {
    "Sent": "tag-amber",
    "Awaiting Approval": "tag-amber",
    "Approved": "tag-green",
  }[item.status] || "tag-mute";

  return (
    <div
      data-testid={`activity-${item.id}`}
      className="bedrock-card hover-lift w-full text-left p-4 flex items-center gap-3"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-strong)" }}
      >
        <span className="font-display font-bold text-[13px]" style={{ color: "var(--gold-bright)" }}>
          {item.client.split(" ").map(s => s[0]).slice(0, 2).join("")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-oswald text-[14.5px] font-semibold truncate min-w-0">{item.client}</span>
          <span className="font-mono text-[10.5px] shrink-0" style={{ color: "var(--text-muted)" }}>{item.when}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5 min-w-0">
          <span className="text-[12px] truncate min-w-0" style={{ color: "var(--text-muted)" }}>
            {item.quoteNo} · {item.job}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="font-mono font-semibold text-[15px]" style={{ color: "var(--gold-bright)" }}>
            {fmtMoney(item.amount)}
          </span>
          <span className={`tag-pill ${statusTag}`}>{item.status}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Follow-up row ---------- */
function FollowupRow({ item, onNudge, onCall }) {
  const riskTag = item.risk === "high" ? "tag-red" : "tag-amber";
  const ageColor = item.age >= 7 ? "var(--red)" : "var(--amber)";
  return (
    <div className="bedrock-card hover-lift p-4" data-testid={`followup-${item.id}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-semibold text-[11.5px] shrink-0" style={{ color: "var(--gold-bright)" }}>
            {item.quoteNo}
          </span>
          <span className={`tag-pill ${riskTag} shrink-0`}>{item.risk.toUpperCase()} RISK</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Clock size={11} style={{ color: ageColor }} />
          <span className="font-mono text-[10.5px] font-semibold" style={{ color: ageColor }}>
            {item.age}d
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
        <span className="font-display font-semibold text-[14.5px] truncate min-w-0">{item.client}</span>
        <span className="font-mono font-semibold text-[15px] shrink-0" style={{ color: "var(--gold-bright)" }}>
          {fmtMoney(item.amount)}
        </span>
      </div>
      <div className="text-[12px] mb-3 truncate" style={{ color: "var(--text-muted)" }}>
        {item.job} · {item.note}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCall}
          className="ghost-btn flex-1 rounded-lg py-2 text-[12px] font-semibold flex items-center justify-center gap-1.5"
          data-testid={`followup-call-${item.id}`}
        >
          <Phone size={12} /> Call
        </button>
        <button
          onClick={onNudge}
          className="gold-btn flex-1 rounded-lg py-2 text-[12px] font-semibold flex items-center justify-center gap-1.5"
          data-testid={`followup-nudge-${item.id}`}
        >
          <Send size={12} /> Nudge
        </button>
      </div>
    </div>
  );
}

function TerrainProConsoleHeader() {
  return (
    <header className="tp-auto-header reveal reveal-1" data-testid="terrainpro-console-header">
      <div className="tp-console-display-grid">
        <div className="tp-heading-block">
          <h1 className="console-title-primary">Alex W</h1>
        </div>

        <div className="tp-location-telemetry">
          <div className="location-badge-wrap">
            <span className="location-main-text">
              Terrain Civil Group
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================== */

export default function MobileDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("activity"); // activity | followup
  const [logoutNotice, setLogoutNotice] = useState(false);
  const savedQuotes = useSavedQuotes();
  const savedRevenue = savedQuotes.reduce((sum, quote) => sum + quote.amount, 0);
  const snapshot = {
    ...SNAPSHOT,
    quotesSent: SNAPSHOT.quotesSent + savedQuotes.length,
    revenue: SNAPSHOT.revenue + savedRevenue,
  };
  const recentActivity = [
    ...savedQuotes.slice(0, 3).map((quote) => ({
      id: quote.id,
      client: quote.client,
      quoteNo: quote.id,
      amount: quote.amount,
      status: "Sent",
      when: quote.age || "just now",
      job: quote.scope || "Ground works",
    })),
    ...RECENT_ACTIVITY,
  ].slice(0, 6);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(t);
  }, []);

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
            aria-label="Settings"
            title="Settings"
            data-testid="top-settings"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="tp-top-action"
            aria-label="Log out"
            title="Log out"
            data-testid="top-logout"
            onClick={() => setLogoutNotice(true)}
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
      {logoutNotice && (
        <div className="tp-logout-notice" role="status">
          Local demo session remains active until account sign-in is connected.
          <button type="button" onClick={() => setLogoutNotice(false)} aria-label="Dismiss sign-out notice">Dismiss</button>
        </div>
      )}
      <TerrainProConsoleHeader />

      {/* GREETING — compact */}
      <div className="hidden">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[12px] font-mono tracking-[0.16em] uppercase" style={{ color: "var(--text-muted)" }}>
            Good morning
          </span>
          <span className="font-display font-bold text-[22px] leading-none" data-testid="greeting">
            {USER.name}<span style={{ color: "var(--gold-bright)" }}>.</span>
          </span>
        </div>
      </div>

      {/* SEARCH — prominent */}
      <div className="relative mb-5 mt-5 reveal reveal-2" data-testid="search-wrap">
        <Search
          className="lucide absolute left-4 top-1/2 -translate-y-1/2"
          size={17}
          style={{ color: "var(--text-muted)" }}
        />
        <input
          data-testid="search-input"
          className="input-field pl-11"
          placeholder="Search clients, quotes or jobs…"
        />
      </div>

      {/* HERO METRIC — Business Snapshot at the top */}
      <section className="mb-4 reveal reveal-3" data-testid="snapshot-section">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-oswald font-extrabold text-[18px]" style={{ color: "var(--text)", letterSpacing: "0.015em" }}>
            Business Snapshot
          </h2>
          <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: "var(--text-muted)" }}>
            This week
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {loading ? (
            <>
              <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
            </>
          ) : (
            <>
              <StatTile
                large
                label="Revenue"
                raw={snapshot.revenue}
                isMoney
                accent="var(--gold-bright)"
                delta="+12.4%"
                testid="stat-revenue"
              />
              <StatTile
                large
                label="Jobs Won"
                raw={snapshot.jobsWon}
                accent="var(--green)"
                testid="stat-jobs-won"
              />
              <StatTile
                label="Quotes Sent"
                raw={snapshot.quotesSent}
                testid="stat-quotes-sent"
              />
              <StatTile
                label="Awaiting"
                raw={snapshot.awaitingApproval}
                accent="var(--amber)"
                testid="stat-awaiting"
              />
            </>
          )}
        </div>
      </section>

      {/* SUBGRADE AI WARNING BANNER */}
      <button
        onClick={() => navigate("/subgrade")}
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
            style={{
              background: "linear-gradient(180deg, rgba(252,213,53,0.25), rgba(240,185,11,0.10))",
              border: "1px solid rgba(252,213,53,0.40)",
            }}
          >
            <ShieldAlert size={19} style={{ color: "var(--gold-bright)" }} />
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full pulse-dot"
              style={{ background: "var(--red)", boxShadow: "0 0 6px var(--red)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9.5px] font-mono tracking-[0.20em] uppercase font-bold" style={{ color: "var(--gold-bright)" }}>
                SUBGRADE&nbsp;AI
              </span>
              <Sparkles size={10} style={{ color: "var(--gold-bright)" }} />
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-mono font-bold text-[20px] leading-none" style={{ color: "var(--gold-bright)" }}>
                <CountUp value={MARGIN_AT_RISK} prefix="$" duration={1400} />
              </span>
              <span className="text-[12.5px] font-medium" style={{ color: "var(--text)" }}>
                unprotected margin detected
              </span>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: "var(--gold-bright)" }} className="shrink-0" />
        </div>
      </button>

      {/* LOWER SECTION — Tabs: Activity / Follow-up */}
      <section className="reveal reveal-5" data-testid="lower-tabs-section">
        <div className="flex items-center justify-between mb-3">
          <div className="bedrock-segmented" style={{ flex: "0 1 auto" }} data-testid="dash-tabs">
            <button
              type="button"
              onClick={() => setTab("activity")}
              className={`bedrock-segment ${tab === "activity" ? "active" : ""}`}
              data-testid="tab-activity"
            >
              Recent Activity
            </button>
            <button
              type="button"
              onClick={() => setTab("followup")}
              className={`bedrock-segment ${tab === "followup" ? "active" : ""}`}
              data-testid="tab-followup"
            >
              <span className="flex items-center gap-1.5">
                Follow-up
                <span
                  className="font-mono font-bold text-[9.5px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: tab === "followup" ? "rgba(0,0,0,0.15)" : "rgba(246,70,93,0.18)",
                    color: tab === "followup" ? "#0A0A0B" : "var(--red)",
                  }}
                >
                  {FOLLOWUPS.length}
                </span>
              </span>
            </button>
          </div>
        </div>

        {tab === "activity" && (
          <div className="space-y-2.5" data-testid="activity-list">
            {loading ? (
              <>
                <ActivityRowSkeleton />
                <ActivityRowSkeleton />
                <ActivityRowSkeleton />
              </>
            ) : (
              recentActivity.map((item) => (
                <SwipeReveal
                  key={item.id}
                  testid={`activity-swipe-${item.id}`}
                  actions={
                    <>
                      <button
                        className="swipe-action-btn gold"
                        data-testid={`activity-call-${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={16} />
                        <span>Call</span>
                      </button>
                      <button
                        className="swipe-action-btn amber"
                        data-testid={`activity-followup-${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Send size={16} />
                        <span>Nudge</span>
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
              <>
                <ActivityRowSkeleton />
                <ActivityRowSkeleton />
                <ActivityRowSkeleton />
              </>
            ) : (
              FOLLOWUPS.map((item) => (
                <FollowupRow key={item.id} item={item} onCall={() => {}} onNudge={() => {}} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
