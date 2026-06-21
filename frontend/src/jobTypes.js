/* eslint-disable */
import React from "react";
import { LogoMark } from "@/codex/components/Logo";

/** Hardware-accelerated shimmer skeleton block */
export function Skeleton({ className = "", style = {}, w, h, rounded = 10 }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: w,
        height: h,
        borderRadius: rounded,
        ...style,
      }}
      data-testid="skeleton"
    />
  );
}

/** Reusable Dashboard activity row skeleton (matches ActivityCard shape) */
export function ActivityRowSkeleton() {
  return (
    <div className="bedrock-card p-4 flex items-center gap-3" data-testid="activity-skeleton">
      <Skeleton w={44} h={44} rounded={12} />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton w="55%" h={14} />
          <Skeleton w={42} h={10} />
        </div>
        <Skeleton w="80%" h={11} />
        <div className="flex items-center justify-between pt-1">
          <Skeleton w={70} h={14} />
          <Skeleton w={56} h={18} rounded={999} />
        </div>
      </div>
    </div>
  );
}

/** Stats tile skeleton (snapshot grid) */
export function StatSkeleton() {
  return (
    <div className="bedrock-card-elev px-3.5 py-3">
      <Skeleton w="55%" h={9} />
      <div className="mt-2.5"><Skeleton w="70%" h={20} /></div>
    </div>
  );
}

/**
 * Branded empty state — minimalist BEDROCK logo mark watermark
 * + headline + microcopy + optional action.
 */
export function EmptyState({ title, subtitle, action, testid }) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-12 relative"
      data-testid={testid || "empty-state"}
    >
      {/* Soft halo */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          width: 220,
          height: 220,
          top: 6,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(240,185,11,0.10), transparent 60%)",
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />
      {/* Logo mark watermark — premium, brand-on-brand */}
      <div className="relative mb-5" style={{ opacity: 0.5 }}>
        <div
          className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          <LogoMark size={38} />
        </div>
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-3xl pointer-events-none"
          style={{
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div className="font-display font-semibold text-[16px] mb-1.5 relative">{title}</div>
      <div className="text-[13px] leading-snug max-w-[260px] relative" style={{ color: "var(--text-muted)" }}>
        {subtitle}
      </div>
      {action && <div className="mt-5 relative">{action}</div>}
    </div>
  );
}
