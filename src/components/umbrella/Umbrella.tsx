"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Topic, Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/constants";
import { UmbrellaPanel, CX, CY } from "./UmbrellaPanel";
import { RainEffect } from "./RainEffect";

interface UmbrellaProps {
  topics: Topic[];
  onTopicClick: (topicId: string) => void;
  searchBar: React.ReactNode;
}

export function Umbrella({ topics, onTopicClick, searchBar }: UmbrellaProps) {
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);

  const countByCategory = (cat: Category) =>
    topics.filter((t) => t.category === cat).length;

  const categoryTopics = expandedCategory
    ? topics
        .filter((t) => t.category === expandedCategory)
        .sort((a, b) => b.importance - a.importance)
    : [];

  const expandedColor = expandedCategory ? CATEGORY_COLORS[expandedCategory] : "#fff";

  const handlePanelClick = (category: Category) => {
    // Toggle: click same panel closes it, click different panel switches
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center pt-20 pb-32 px-4">
      <RainEffect />

      {/* Umbrella SVG — bigger viewBox for larger folds */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl"
      >
        <svg viewBox="0 0 1000 560" className="w-full drop-shadow-2xl">
          {/* Panels */}
          {CATEGORIES.map((cat, i) => (
            <UmbrellaPanel
              key={cat}
              category={cat}
              index={i}
              topicCount={countByCategory(cat)}
              isExpanded={expandedCategory === cat}
              onClick={handlePanelClick}
            />
          ))}

          {/* Pole */}
          <line
            x1={CX} y1={CY} x2={CX} y2={CY + 150}
            stroke="#64748b" strokeWidth={3} strokeLinecap="round"
          />

          {/* J-hook handle */}
          <path
            d={`M ${CX} ${CY + 150} Q ${CX} ${CY + 175}, ${CX - 18} ${CY + 175} Q ${CX - 36} ${CY + 175}, ${CX - 36} ${CY + 160}`}
            fill="none" stroke="#64748b" strokeWidth={3} strokeLinecap="round"
          />

          {/* Top tip */}
          <circle cx={CX} cy={38} r={3.5} fill="#64748b" />
          <line x1={CX} y1={42} x2={CX} y2={58} stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="relative z-10 mt-2 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-white">
          CS Umbrella
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Click a category to explore its topics
        </p>
        <div className="mt-5">
          {searchBar}
        </div>
      </motion.div>

      {/* Expanded category topics — stays visible until user clicks another or closes */}
      <AnimatePresence mode="wait">
        {expandedCategory && (
          <motion.div
            key={expandedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 mt-8 w-full max-w-4xl"
          >
            {/* Category header */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: expandedColor }}
              />
              <h2
                className="text-xl font-semibold"
                style={{ color: expandedColor }}
              >
                {expandedCategory}
              </h2>
              <span className="text-sm text-[var(--text-secondary)]">
                {categoryTopics.length} topics
              </span>
              <button
                onClick={() => setExpandedCategory(null)}
                className="ml-auto rounded-lg p-1 text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Topic grid */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTopics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  onClick={() => onTopicClick(topic.id)}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-all hover:border-opacity-60 hover:bg-white/5"
                  style={{ borderColor: `${expandedColor}20` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-white">
                      {topic.name}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${DIFFICULTY_COLORS[topic.difficulty]}15`,
                        color: DIFFICULTY_COLORS[topic.difficulty],
                      }}
                    >
                      {topic.difficulty}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {topic.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
