"use client";

import { ViewMode } from "@/lib/types";

interface NavbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function Navbar({ view, onViewChange }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md px-6 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <defs>
            <linearGradient id="nav-canopy" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="25%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="75%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          {/* Filled canopy */}
          <path d="M3 17 C3 7, 9 2, 16 2 C23 2, 29 7, 29 17 Z" fill="url(#nav-canopy)" fillOpacity="0.25" stroke="url(#nav-canopy)" strokeWidth="1.5" />
          {/* Top tip */}
          <circle cx="16" cy="2" r="1.5" fill="#94a3b8" />
          {/* Pole */}
          <line x1="16" y1="17" x2="16" y2="26" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* J-hook */}
          <path d="M16 26 Q16 29.5 13 29.5 Q10 29.5 10 27" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-lg font-semibold text-[var(--text-primary)]">CS Umbrella</span>
      </div>

      {/* View toggle — centered */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
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

      {/* Spacer for right side */}
      <div className="w-32" />
    </nav>
  );
}
