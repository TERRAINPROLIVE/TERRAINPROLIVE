/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, HardHat, Filter } from "lucide-react";
import { JOBS } from "@/codex/data/mockData";

const fmt = (n) => `$${n.toLocaleString("en-AU")}`;
const FILTERS = ["All", "Scheduled", "In Progress", "Completed"];

const STATUS_TAG = {
  "Scheduled": "tag-amber",
  "In Progress": "tag-gold",
  "Awaiting Materials": "tag-amber",
  "Completed": "tag-green",
};

export default function Jobs() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? JOBS : JOBS.filter((j) => j.status === filter);

  return (
    <div className="px-5 pt-12 pb-6" data-testid="jobs-page">
      <header className="flex items-center justify-between mb-5">
        <button
          data-testid="jobs-back"
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="font-display font-semibold text-[15px]">Jobs</div>
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <Filter size={16} />
        </button>
      </header>

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1" data-testid="jobs-filters">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-testid={`jobs-filter-${f}`}
              className="px-3.5 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap"
              style={{
                background: active ? "var(--gold)" : "var(--surface-2)",
                color: active ? "#0A0A0B" : "var(--text-muted)",
                border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5">
        {list.map((j) => (
          <div key={j.id} className="bedrock-card p-4" data-testid={`job-card-${j.id}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}
                >
                  <HardHat size={16} style={{ color: "var(--gold-bright)" }} />
                </div>
                <div>
                  <div className="font-display font-semibold text-[14px]">{j.client}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{j.title}</div>
                </div>
              </div>
              <span className={`tag-pill ${STATUS_TAG[j.status]}`}>{j.status}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3"
                 style={{ borderTop: "1px solid var(--border-soft)" }}>
              <div className="space-y-0.5">
                <div className="text-[11.5px] flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  <Calendar size={11} /> {j.start}
                </div>
                <div className="text-[11.5px] flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  <MapPin size={11} /> {j.address}
                </div>
              </div>
              <span className="font-mono font-semibold text-[15px]" style={{ color: "var(--gold-bright)" }}>{fmt(j.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
