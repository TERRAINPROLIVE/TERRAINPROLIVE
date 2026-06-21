/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { CLIENTS } from "@/codex/data/mockData";

const fmt = (n) => `$${n.toLocaleString("en-AU")}`;

export default function Clients() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const list = CLIENTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="px-5 pt-12 pb-6" data-testid="clients-page">
      <header className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate("/dashboard")}
          data-testid="clients-back"
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="font-display font-semibold text-[15px]">Clients</div>
        <button
          data-testid="clients-add"
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <Plus size={18} style={{ color: "var(--gold-bright)" }} />
        </button>
      </header>

      <div className="relative mb-4">
        <Search className="lucide absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--text-faint)" }} />
        <input
          data-testid="clients-search"
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients…" className="input-field pl-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <Stat label="Total Clients" value={CLIENTS.length} />
        <Stat label="Total Value" value={fmt(CLIENTS.reduce((s, c) => s + c.value, 0))} accent="var(--gold-bright)" />
      </div>

      <div className="space-y-2.5">
        {list.map((c) => (
          <div key={c.id} className="bedrock-card p-4" data-testid={`client-card-${c.id}`}>
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}
              >
                <span className="font-display font-bold text-[12.5px]" style={{ color: "var(--gold-bright)" }}>
                  {c.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-display font-semibold text-[14.5px] truncate">{c.name}</div>
                  <ArrowUpRight size={16} style={{ color: "var(--text-faint)" }} />
                </div>
                <div className="text-[11.5px] mb-2" style={{ color: "var(--text-faint)" }}>{c.company}</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Phone size={11} />{c.phone}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{c.suburb}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
                  <span className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                    <span className="font-mono font-semibold" style={{ color: "var(--text)" }}>{c.jobs}</span> jobs
                  </span>
                  <span className="font-mono font-semibold text-[14px]" style={{ color: "var(--gold-bright)" }}>{fmt(c.value)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="bedrock-card-elev p-3.5">
      <div className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="font-mono font-semibold text-[20px] mt-1" style={{ color: accent || "var(--text)" }}>{value}</div>
    </div>
  );
}
