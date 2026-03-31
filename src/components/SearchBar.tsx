"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, Search } from "lucide-react";
import { Topic } from "@/lib/types";
import { createSearch } from "@/lib/search";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/constants";

interface SearchBarProps {
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
}

// Typewriter placeholder that cycles through topic names
function useTypewriter(topics: Topic[], speed = 60, pause = 2000) {
  const [placeholder, setPlaceholder] = useState("Search CS topics...");
  const indexRef = useRef(0);

  useEffect(() => {
    if (topics.length === 0) return;

    // Pick 8 interesting topics to cycle through
    const samples = topics
      .filter((t) => t.importance >= 4)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)
      .map((t) => t.name);

    let charIndex = 0;
    let sampleIndex = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = samples[sampleIndex % samples.length];
      const prefix = "Search for ";

      if (!isDeleting) {
        charIndex++;
        setPlaceholder(prefix + current.slice(0, charIndex) + "|");

        if (charIndex === current.length) {
          setPlaceholder(prefix + current);
          isDeleting = true;
          timeout = setTimeout(tick, pause);
          return;
        }
        timeout = setTimeout(tick, speed);
      } else {
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          sampleIndex++;
          timeout = setTimeout(tick, speed * 3);
          return;
        }
        setPlaceholder(prefix + current.slice(0, charIndex) + "|");
        timeout = setTimeout(tick, speed / 2);
      }
    };

    // Start after a delay
    timeout = setTimeout(tick, 1500);

    return () => clearTimeout(timeout);
  }, [topics, speed, pause]);

  return placeholder;
}

export function SearchBar({ topics, onTopicSelect }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => createSearch(topics), [topics]);
  const placeholder = useTypewriter(topics);

  const results = value.trim()
    ? fuse.search(value).slice(0, 8).map((r) => r.item)
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [value]);

  // Cmd+K focuses
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSelect = useCallback(
    (topicId: string) => {
      onTopicSelect(topicId);
      setValue("");
      inputRef.current?.blur();
    },
    [onTopicSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
      return;
    }
    if (results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].id);
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search input */}
      <div className={cn(
        "relative rounded-xl border bg-neutral-900/80 backdrop-blur-sm transition-all",
        focused ? "border-white/20 shadow-lg shadow-white/5" : "border-neutral-800"
      )}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-neutral-500" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
          />
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-500">
              ⌘K
            </kbd>
            {value.trim() && (
              <button
                type="button"
                onClick={() => {
                  if (results[selectedIndex]) handleSelect(results[selectedIndex].id);
                }}
                className="rounded-md bg-white p-1 text-black transition-colors hover:bg-white/90"
              >
                <ArrowUpIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results dropdown */}
      {results.length > 0 && focused && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-neutral-800 bg-[#141420] shadow-2xl overflow-hidden">
          {results.map((topic, i) => (
            <button
              key={topic.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(topic.id);
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                i === selectedIndex ? "bg-white/5" : "hover:bg-white/5"
              )}
            >
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[topic.category] }}
              />
              <span className="flex-1 text-sm text-[var(--text-primary)]">
                {topic.name}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[topic.category]}15`,
                  color: CATEGORY_COLORS[topic.category],
                }}
              >
                {topic.category}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${DIFFICULTY_COLORS[topic.difficulty]}15`,
                  color: DIFFICULTY_COLORS[topic.difficulty],
                }}
              >
                {topic.difficulty}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
