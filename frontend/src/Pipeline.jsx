/* eslint-disable */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ShieldAlert, Sparkles, Truck, Forklift, Route, Trash2,
  Landmark, Clock, AlertTriangle, Users, PackageMinus, Hourglass,
  FileBadge, CloudRain, Wrench, MapPin, Boxes
} from "lucide-react";
import { HIDDEN_COST_CATEGORIES, DASHBOARD_RISKS } from "@/codex/data/mockData";

const ICONS = {
  Truck, Forklift, Route, Trash2, Landmark, Clock, AlertTriangle, Users,
  PackageMinus, Hourglass, FileBadge, CloudRain, Wrench, MapPin, Boxes
};

export default function AICostReview() {
  const navigate = useNavigate();
  const totalRisk = DASHBOARD_RISKS.reduce((s, r) => s + r.est, 0);

  return (
    <div className="px-5 pt-12 pb-6" data-testid="subgrade-page">
      <header className="flex items-center justify-between mb-5">
        <button
          data-testid="subgrade-back"
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="font-display font-semibold text-[15px]">SUBGRADE AI</div>
        <div style={{ width: 40 }} />
      </header>

      {/* HERO */}
      <div className="rounded-2xl p-[1px] mb-5"
           style={{ background: "linear-gradient(135deg, rgba(240,185,11,0.6), rgba(240,185,11,0.05) 50%, rgba(240,185,11,0.45))" }}>
        <div className="rounded-2xl p-5"
             style={{ background: "radial-gradient(120% 100% at 0% 0%, rgba(240,185,11,0.10), transparent 55%), linear-gradient(180deg, #16161A, #111114)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                 style={{ background: "rgba(240,185,11,0.16)", border: "1px solid rgba(240,185,11,0.32)" }}>
              <ShieldAlert size={20} style={{ color: "var(--gold-bright)" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-[16px]">Hidden Cost Intelligence</span>
                <Sparkles size={13} style={{ color: "var(--gold-bright)" }} />
              </div>
              <div className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
                Scanning 15 cost vectors · v2.4
              </div>
            </div>
          </div>
          <p className="text-[13.5px]" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--gold-bright)" }} className="font-semibold">SUBGRADE AI</span> learns
            from your past quotes, supplier locations and site conditions to flag costs you may
            forget — protecting your margin before you send.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Metric label="Active Risks" value={DASHBOARD_RISKS.length} accent="var(--red)" />
            <Metric label="Allowance" value={`$${totalRisk}`} accent="var(--gold-bright)" />
            <Metric label="Saved YTD" value="$8.2k" accent="var(--green)" />
          </div>
        </div>
      </div>

      {/* Live alerts */}
      <SectionLabel>Live Margin Alerts</SectionLabel>
      <div className="space-y-2 mb-6">
        {DASHBOARD_RISKS.map((r, i) => (
          <div key={i} className="bedrock-card p-4" data-testid={`subgrade-alert-${i}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-semibold text-[12px]" style={{ color: "var(--gold-bright)" }}>{r.quote}</span>
              <span className={`tag-pill ${r.severity === "high" ? "tag-red" : "tag-amber"}`}>
                {r.severity.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: "var(--text)" }}>{r.flag}</span>
              <span className="font-mono font-semibold text-[14px]" style={{ color: "var(--amber)" }}>+${r.est}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detection vectors */}
      <SectionLabel>What we scan for</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {HIDDEN_COST_CATEGORIES.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <div key={c.id} className="bedrock-card p-3 flex items-center gap-2.5" data-testid={`subgrade-vector-${c.id}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                {Icon && <Icon size={14} style={{ color: "var(--gold-bright)" }} />}
              </div>
              <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{c.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div className="rounded-xl px-3 py-2.5"
         style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-soft)" }}>
      <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="font-mono font-semibold text-[16px] mt-0.5" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="text-[10.5px] font-mono uppercase tracking-wider font-semibold mb-2.5"
         style={{ color: "var(--text-faint)" }}>
      {children}
    </div>
  );
}
