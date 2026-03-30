"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Topic } from "@/lib/types";
import { createSearch } from "@/lib/search";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";

interface SearchOverlayProps {
  topics: Topic[];
  onSelect: (topicId: string) => void;
  onClose: () => void;
}

export function SearchOverlay({ topics, onSelect, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => createSearch(topics), [topics]);

  const results = query.trim()
    ? fuse.search(query).slice(0, 10).map((r) => r.item)
    : [];

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? Math.min(prev + 1, results.length - 1) : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (results[selectedIndex]) {
          onSelect(results[selectedIndex].id);
          onClose();
        }
      }
    },
    [results, selectedIndex, onSelect, onClose]
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      style={{ paddingTop: "20vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-lg mx-4 rounded-xl border border-white/10 bg-[#0f0f0f] shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        style={{ maxHeight: "60vh" }}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <svg
            className="shrink-0 text-white/40"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics..."
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-white/15 px-1.5 py-0.5 text-[11px] text-white/30 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results / empty state */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(60vh - 56px)" }}>
          {!query.trim() ? (
            <p className="px-4 py-8 text-center text-sm text-white/30">
              Type to search 75+ CS topics
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-white/30">
              No topics found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {results.map((topic, i) => (
                <li key={topic.id}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      i === selectedIndex ? "bg-white/5" : "hover:bg-white/[0.03]"
                    }`}
                    onClick={() => {
                      onSelect(topic.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="flex-1 text-sm font-medium text-white truncate">
                      {topic.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CategoryBadge category={topic.category} />
                      <DifficultyBadge difficulty={topic.difficulty} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
