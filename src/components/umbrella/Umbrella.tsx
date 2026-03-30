"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Topic, Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/constants";
import { UmbrellaPanel } from "./UmbrellaPanel";
import { RainEffect } from "./RainEffect";

interface UmbrellaProps {
  topics: Topic[];
  onTopicClick: (topicId: string) => void;
}

export function Umbrella({ topics, onTopicClick }: UmbrellaProps) {
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);

  const countByCategory = (cat: Category) =>
    topics.filter((t) => t.category === cat).length;

  const categoryTopics = expandedCategory
    ? topics
        .filter((t) => t.category === expandedCategory)
        .sort((a, b) => b.importance - a.importance)
    : [];

  const expandedColor = expandedCategory ? CATEGORY_COLORS[expandedCategory] : "#fff";

  return (
    <div className="relative flex min-h-screen flex-col items-center pt-20 pb-32 px-4">
      <RainEffect />

      {/* Umbrella SVG */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <svg viewBox="0 0 800 480" className="w-full drop-shadow-2xl">
          {/* Panels — canopy arcs across the top */}
          {CATEGORIES.map((cat, i) => (
            <UmbrellaPanel
              key={cat}
              category={cat}
              index={i}
              topicCount={countByCategory(cat)}
              isExpanded={expandedCategory === cat}
              onHover={setExpandedCategory}
              onClick={(c) => setExpandedCategory(expandedCategory === c ? null : c)}
            />
          ))}

          {/* Pole — straight down from center of canopy */}
          <line
            x1={400} y1={280} x2={400} y2={420}
            stroke="#64748b" strokeWidth={3} strokeLinecap="round"
          />

          {/* J-hook handle */}
          <path
            d="M 400 420 Q 400 445, 382 445 Q 364 445, 364 430"
            fill="none" stroke="#64748b" strokeWidth={3} strokeLinecap="round"
          />

          {/* Top tip — top center of canopy */}
          <circle cx={400} cy={58} r={3.5} fill="#64748b" />
          <line x1={400} y1={62} x2={400} y2={75} stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
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
          Hover over a category to explore its topics
        </p>
      </motion.div>

      {/* Expanded category topics — inline below umbrella */}
      <AnimatePresence mode="wait">
        {expandedCategory && (
          <motion.div
            key={expandedCategory}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 mt-6 w-full max-w-4xl overflow-hidden"
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
            </div>

            {/* Topic grid */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTopics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
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
