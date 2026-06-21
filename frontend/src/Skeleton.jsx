/* eslint-disable */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Plus, HardHat, MoreHorizontal } from "lucide-react";
import "../codex.css";

const NAV = [
  { id: "dashboard", icon: Home, label: "Home", path: "/dashboard" },
  { id: "ledger", icon: FileText, label: "Quotes", path: "/quotes" },
  { id: "new-quote", icon: Plus, label: "Quote", path: "/new-quote", primary: true },
  { id: "jobs", icon: HardHat, label: "Jobs", path: "/jobs" },
  { id: "more", icon: MoreHorizontal, label: "More", path: "/more" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hideChrome = ["/new-quote", "/quote"].includes(location.pathname);

  return (
    <div className="tp-codex mobile-shell" data-testid="app-shell">
      <main className={`relative ${hideChrome ? "pb-6" : "pb-28"}`} data-testid="main-content">
        {children}
      </main>

      {!hideChrome && (
        <nav
          aria-label="Primary navigation"
          data-testid="bottom-nav"
          className="tp-console-navigation fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.primary ? "Create new quote" : item.label}
                aria-current={active ? "page" : undefined}
                data-testid={`nav-${item.id}`}
                onClick={() => navigate(item.path)}
                className={`console-nav-item ${item.primary ? "primary" : ""} ${active ? "active" : ""}`}
              >
                <span className="nav-icon-wrap">
                  <Icon size={item.primary ? 25 : 21} strokeWidth={item.primary ? 2.6 : active ? 2.4 : 1.9} />
                </span>
                <span className="nav-text-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
