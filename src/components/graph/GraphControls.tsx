"use client";

import { Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface GraphControlsProps {
  categoryFilters: Set<Category>;
  onToggleCategory: (category: Category) => void;
  difficultyFilter: string | null;
  onSetDifficulty: (difficulty: string | null) => void;
  onResetZoom: () => void;
}

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export function GraphControls({
  categoryFilters,
  onToggleCategory,
  difficultyFilter,
  onSetDifficulty,
  onResetZoom,
}: GraphControlsProps) {
  return (
    <div className="absolute top-18 right-4 z-20 flex flex-col gap-3 w-52">
      {/* Category filters */}
      <div
        className="rounded-xl p-3 flex flex-col gap-2"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Categories
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = categoryFilters.has(cat);
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className="px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer"
                style={{
                  background: active ? color + "33" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
                  color: active ? color : "rgba(255,255,255,0.5)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty filter */}
      <div
        className="rounded-xl p-3 flex flex-col gap-2"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Difficulty
        </p>
        <div className="flex flex-col gap-1">
          {DIFFICULTIES.map((diff) => {
            const active = difficultyFilter === diff;
            return (
              <button
                key={diff}
                onClick={() => onSetDifficulty(active ? null : diff)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-left transition-all duration-150 cursor-pointer"
                style={{
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                  border: active ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                }}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset zoom */}
      <Button variant="ghost" size="sm" onClick={onResetZoom} className="self-start">
        Reset Zoom
      </Button>
    </div>
  );
}
