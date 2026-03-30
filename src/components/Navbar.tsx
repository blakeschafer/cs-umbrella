"use client";

import { ViewMode } from "@/lib/types";

interface NavbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onSearchClick: () => void;
}

export function Navbar({ view, onViewChange, onSearchClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md px-6 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <defs>
            <linearGradient id="nav-canopy" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <path d="M4 18 Q4 4 16 4 Q28 4 28 18" fill="none" stroke="url(#nav-canopy)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="18" x2="16" y2="26" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 26 Q16 29 13.5 29 Q11 29 11 27" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-lg font-semibold text-[var(--text-primary)]">CS Umbrella</span>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={() => onViewChange("umbrella")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            view === "umbrella"
              ? "bg-white/10 text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12 Q3 3 10 3 Q17 3 17 12" strokeLinecap="round" />
            <line x1="10" y1="12" x2="10" y2="17" strokeLinecap="round" />
          </svg>
          Umbrella
        </button>
        <button
          onClick={() => onViewChange("graph")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            view === "graph"
              ? "bg-white/10 text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="5" r="2" />
            <circle cx="5" cy="15" r="2" />
            <circle cx="15" cy="15" r="2" />
            <line x1="10" y1="7" x2="5" y2="13" />
            <line x1="10" y1="7" x2="15" y2="13" />
            <line x1="5" y1="15" x2="15" y2="15" />
          </svg>
          Graph
        </button>
      </div>

      {/* Search */}
      <button
        onClick={onSearchClick}
        className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
        <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
    </nav>
  );
}
