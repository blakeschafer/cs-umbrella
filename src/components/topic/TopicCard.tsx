"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, Video, FileText, GraduationCap, Network, GitBranch } from "lucide-react";
import { Topic, Relationship, Resource } from "@/lib/types";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TopicCardProps {
  topic: Topic;
  allTopics: Topic[];
  relationships: Relationship[];
  resources: Resource[];
  onClose: () => void;
  onTopicSelect: (id: string) => void;
  onViewInGraph: (id: string) => void;
  onExploreConnections: (id: string) => void;
}

const RESOURCE_ICONS = {
  video: Video,
  article: FileText,
  course: GraduationCap,
} as const;

const RESOURCE_LABELS = {
  video: "Videos",
  article: "Articles",
  course: "Courses",
} as const;

export function TopicCard({
  topic,
  allTopics,
  relationships,
  resources,
  onClose,
  onTopicSelect,
  onViewInGraph,
  onExploreConnections,
}: TopicCardProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(true);

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

  const prerequisites = relationships
    .filter((r) => r.target === topic.id && r.type === "prerequisite")
    .map((r) => allTopics.find((t) => t.id === r.source))
    .filter(Boolean) as Topic[];

  const related = relationships
    .filter(
      (r) =>
        (r.source === topic.id || r.target === topic.id) && r.type === "related"
    )
    .map((r) => {
      const otherId = r.source === topic.id ? r.target : r.source;
      return allTopics.find((t) => t.id === otherId);
    })
    .filter(Boolean) as Topic[];

  const topicResources = resources.filter((r) => r.topicId === topic.id);
  const grouped = (["video", "article", "course"] as const).reduce(
    (acc, type) => {
      const items = topicResources.filter((r) => r.type === type);
      if (items.length > 0) acc[type] = items;
      return acc;
    },
    {} as Partial<Record<"video" | "article" | "course", Resource[]>>
  );

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
        className="absolute right-0 top-14 h-[calc(100%-3.5rem)] w-[420px] max-w-full overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] leading-tight">
                {topic.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <CategoryBadge category={topic.category} />
                <DifficultyBadge difficulty={topic.difficulty} />
              </div>
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

        {/* Body */}
        <div className="px-5 py-5 space-y-6">
          {/* Description */}
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            {topic.description}
          </p>

          {/* Tags */}
          {topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--bg)] px-2 py-0.5 text-xs text-[var(--text-secondary)] border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <section>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Prerequisites
              </h3>
              <div className="flex flex-wrap gap-2">
                {prerequisites.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onTopicSelect(t.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Related Topics */}
          {related.length > 0 && (
            <section>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {related.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onTopicSelect(t.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Roadmap */}
          {topic.roadmap && topic.roadmap.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Learning Roadmap
              </h3>
              <div className="space-y-0">
                {topic.roadmap.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] text-[10px] font-semibold text-[var(--text-secondary)]">
                        {i + 1}
                      </div>
                      {i < topic.roadmap!.length - 1 && (
                        <div className="w-px flex-1 bg-[var(--border)]" />
                      )}
                    </div>
                    <p className="pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Resources */}
          {Object.keys(grouped).length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Resources
              </h3>
              <div className="space-y-4">
                {(["video", "article", "course"] as const).map((type) => {
                  const items = grouped[type];
                  if (!items) return null;
                  const Icon = RESOURCE_ICONS[type];
                  return (
                    <div key={type}>
                      <p className="mb-1.5 text-xs font-medium text-[var(--text-secondary)]">
                        {RESOURCE_LABELS[type]}
                      </p>
                      <div className="space-y-1.5">
                        {items.map((res) => (
                          <a
                            key={res.url}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 hover:border-[var(--text-secondary)] transition-colors group"
                          >
                            <Icon
                              size={14}
                              className="flex-shrink-0 text-[var(--text-secondary)]"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-[var(--text-primary)] group-hover:text-white transition-colors">
                                {res.title}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {res.source}
                              </p>
                            </div>
                            <ExternalLink
                              size={12}
                              className="flex-shrink-0 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewInGraph(topic.id)}
              className="flex-1 gap-1.5"
            >
              <Network size={14} />
              View in Graph
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExploreConnections(topic.id)}
              className="flex-1 gap-1.5"
            >
              <GitBranch size={14} />
              Explore Connections
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
