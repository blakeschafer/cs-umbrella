"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Category, Topic } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { DifficultyBadge } from "@/components/ui/Badge";

interface TopicListProps {
  category: Category;
  topics: Topic[];
  onTopicSelect: (id: string) => void;
  onClose: () => void;
}

export function TopicList({ category, topics, onTopicSelect, onClose }: TopicListProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(true);
  const color = CATEGORY_COLORS[category];

  useEffect(() => {
    const timer = setTimeout(() => {
      justOpenedRef.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (justOpenedRef.current) return;
    if (e.target === overlayRef.current) onClose();
  };

  const sorted = [...topics].sort((a, b) => b.importance - a.importance);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-30"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 h-full w-[420px] max-w-full overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2
                className="text-xl font-semibold leading-tight"
                style={{ color }}
              >
                {category}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {sorted.length} {sorted.length === 1 ? "topic" : "topics"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-0.5 flex-shrink-0 rounded-md p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Topic list */}
        <div className="px-4 py-4 space-y-2">
          {sorted.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3.5 text-left hover:border-[var(--text-secondary)] transition-colors group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-medium text-[var(--text-primary)] group-hover:text-white transition-colors text-sm leading-tight">
                  {topic.name}
                </span>
                <DifficultyBadge difficulty={topic.difficulty} />
              </div>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {topic.description}
              </p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
