/* eslint-disable */
import React from "react";

/**
 * TERRAINPRO brand mark - geological "core sample" cross-section.
 * Reads as a tight diamond / drill-core with layered strata and a gold cap edge.
 * Designed to look great at 18px (header) and 64px (splash).
 */
export function LogoMark({ size = 26, mono = false }) {
  const gold = "#FCD535";
  const goldDeep = "#F0B90B";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bedrock-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gold} />
          <stop offset="100%" stopColor={goldDeep} />
        </linearGradient>
        <linearGradient id="bedrock-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3A42" />
          <stop offset="100%" stopColor="#1A1A1F" />
        </linearGradient>
      </defs>

      {/* Outer diamond-hex container */}
      <path
        d="M20 2.5 L36 12 L36 28 L20 37.5 L4 28 L4 12 Z"
        fill={mono ? "#1A1A1F" : "url(#bedrock-stone)"}
        stroke="#2A2A30"
        strokeWidth="1"
      />

      {/* Gold cap layer — top stratum */}
      <path
        d="M20 2.5 L36 12 L36 16 L20 25.5 L4 16 L4 12 Z"
        fill={mono ? "#8B8B92" : "url(#bedrock-gold)"}
      />

      {/* Inner strata bands */}
      <g opacity="0.55">
        <path d="M5 19 L35 19 L35 20.3 L5 20.3 Z" fill="#5A5A62" />
        <path d="M5 23 L35 23 L35 24 L5 24 Z" fill="#3A3A42" />
        <path d="M5 27 L35 27 L35 27.7 L5 27.7 Z" fill="#2A2A30" />
      </g>

      {/* Subtle highlight on top-left facet */}
      <path
        d="M20 2.5 L36 12 L20 17 Z"
        fill="white"
        opacity={mono ? 0.04 : 0.10}
      />
    </svg>
  );
}

export function Logo({ size = 22 }) {
  return (
    <div className="flex items-center gap-2.5" data-testid="brand-logo">
      <LogoMark size={size + 6} />
      <div className="flex flex-col leading-none">
        <span className="font-display font-bold tracking-tight text-[17px] text-white">
          TERRAIN<span style={{ color: "var(--bybit-yellow)" }}>PRO</span>
        </span>
        <span
          className="font-mono text-[8.5px] tracking-[0.25em] mt-1"
          style={{ color: "var(--text-faint)" }}
        >
          QUOTING&nbsp;TERMINAL
        </span>
      </div>
    </div>
  );
}
