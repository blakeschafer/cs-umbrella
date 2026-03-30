"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";
import { Topic } from "@/lib/types";
import { createSearch } from "@/lib/search";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/constants";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface SearchBarProps {
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
}

export function SearchBar({ topics, onTopicSelect }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 44,
    maxHeight: 120,
  });

  const fuse = useMemo(() => createSearch(topics), [topics]);

  const results = value.trim()
    ? fuse.search(value).slice(0, 6).map((r) => r.item)
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [value]);

  // Cmd+K focuses the search bar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [textareaRef]);

  const handleSelect = useCallback(
    (topicId: string) => {
      onTopicSelect(topicId);
      setValue("");
      adjustHeight(true);
      textareaRef.current?.blur();
    },
    [onTopicSelect, adjustHeight, textareaRef]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setValue("");
      adjustHeight(true);
      textareaRef.current?.blur();
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

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].id);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Results dropdown — appears above the search bar */}
      {results.length > 0 && (
        <div className="mx-auto w-full max-w-2xl px-4">
          <div className="rounded-t-xl border border-b-0 border-neutral-800 bg-[#141420] shadow-2xl">
            {results.map((topic, i) => (
              <button
                key={topic.id}
                onClick={() => handleSelect(topic.id)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  i === selectedIndex ? "bg-white/5" : "hover:bg-white/5",
                  i === 0 && "rounded-t-xl"
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
        </div>
      )}

      {/* Search input bar */}
      <div className="border-t border-neutral-800 bg-[#0a0a0f]/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
          <div className="relative rounded-xl border border-neutral-800 bg-neutral-900">
            <div className="overflow-y-auto">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search CS topics..."
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white text-sm",
                  "focus:outline-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-neutral-500 placeholder:text-sm",
                  "min-h-[44px]"
                )}
                style={{ overflow: "hidden" }}
              />
            </div>

            <div className="flex items-center justify-between px-3 pb-2">
              <div className="flex items-center gap-2">
                <kbd className="rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-500">
                  ⌘K
                </kbd>
                <span className="text-[10px] text-neutral-600">to focus</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex].id);
                  }
                }}
                className={cn(
                  "rounded-lg p-1.5 text-sm transition-colors",
                  value.trim()
                    ? "bg-white text-black"
                    : "border border-neutral-700 text-neutral-500"
                )}
              >
                <ArrowUpIcon className={cn("h-4 w-4", value.trim() ? "text-black" : "text-neutral-500")} />
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
