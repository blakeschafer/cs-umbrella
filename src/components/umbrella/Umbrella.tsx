"use client";

import { motion } from "framer-motion";
import { Topic, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { UmbrellaPanel } from "./UmbrellaPanel";
import { RainEffect } from "./RainEffect";

interface UmbrellaProps {
  topics: Topic[];
  onCategoryClick: (category: Category) => void;
  onExploreClick: () => void;
  onSearchClick: () => void;
}

export function Umbrella({ topics, onCategoryClick, onExploreClick, onSearchClick }: UmbrellaProps) {
  const countByCategory = (cat: Category) =>
    topics.filter((t) => t.category === cat).length;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <RainEffect />

      {/* Umbrella SVG */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl"
      >
        <svg viewBox="0 0 800 500" className="w-full drop-shadow-2xl">
          {/* Panels */}
          {CATEGORIES.map((cat, i) => (
            <UmbrellaPanel
              key={cat}
              category={cat}
              index={i}
              topicCount={countByCategory(cat)}
              onClick={onCategoryClick}
            />
          ))}

          {/* Pole */}
          <line
            x1={400}
            y1={300}
            x2={400}
            y2={440}
            stroke="#94a3b8"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* J-hook handle */}
          <path
            d="M 400 440 Q 400 460 385 465 Q 370 470 365 455"
            fill="none"
            stroke="#94a3b8"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Top tip */}
          <circle cx={400} cy={50} r={4} fill="#94a3b8" />

          {/* Top tip connector line to canopy */}
          <line
            x1={400}
            y1={54}
            x2={400}
            y2={80}
            stroke="#94a3b8"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Title & actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-4 text-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-white">
          CS Umbrella
        </h1>
        <p className="max-w-md text-[var(--text-secondary)]">
          Your interactive map to computer science. Click a panel to explore a
          category, or dive into the knowledge graph.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="mt-2 flex gap-3"
        >
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
            <kbd className="ml-1 rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/40">
              Cmd+K
            </kbd>
          </button>

          <button
            onClick={onExploreClick}
            className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Explore Graph &rarr;
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
