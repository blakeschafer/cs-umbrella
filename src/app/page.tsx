"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ViewMode, Category, Topic, Relationship as RelType, Resource as ResType } from "@/lib/types";
import { Umbrella } from "@/components/umbrella/Umbrella";
import { GraphView } from "@/components/graph/GraphView";
import { GraphControls } from "@/components/graph/GraphControls";
import { TopicCard } from "@/components/topic/TopicCard";
import { TopicList } from "@/components/topic/TopicList";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import topicsData from "@/data/topics.json";
import relationshipsData from "@/data/relationships.json";
import resourcesData from "@/data/resources.json";

const topics = topicsData as Topic[];
const relationships = relationshipsData as RelType[];
const resources = resourcesData as ResType[];

export default function Home() {
  const [view, setView] = useState<ViewMode>("umbrella");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Set<Category>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const selectedTopic = selectedTopicId
    ? topics.find((t) => t.id === selectedTopicId) ?? null
    : null;

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
    setShowCategoryList(false);
  }, []);

  const handleExploreConnections = useCallback((topicId: string) => {
    setView("graph");
    setHighlightedNodeId(topicId);
    setSelectedTopicId(null);
    setShowCategoryList(false);
  }, []);

  const handleViewInGraph = useCallback((topicId: string) => {
    setView("graph");
    setHighlightedNodeId(topicId);
    setSelectedTopicId(topicId);
    setShowCategoryList(false);
  }, []);

  const handleBackToUmbrella = useCallback(() => {
    setView("umbrella");
    setHighlightedNodeId(null);
  }, []);

  const handleCloseTopicCard = useCallback(() => {
    setSelectedTopicId(null);
  }, []);

  const handleToggleCategory = useCallback((category: Category) => {
    setCategoryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "umbrella" ? (
          <motion.div
            key="umbrella"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Umbrella
              topics={topics}
              onCategoryClick={(category) => {
                setSelectedCategory(category);
                setShowCategoryList(true);
                setSelectedTopicId(null);
              }}
              onExploreClick={() => setView("graph")}
              onSearchClick={() => setSearchOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            {/* Graph component */}
            <GraphView
              topics={topics}
              relationships={relationships}
              highlightedNodeId={highlightedNodeId}
              onNodeClick={handleTopicSelect}
              onBackClick={handleBackToUmbrella}
              categoryFilters={categoryFilters}
              difficultyFilter={difficultyFilter}
            />
            <GraphControls
              categoryFilters={categoryFilters}
              onToggleCategory={handleToggleCategory}
              difficultyFilter={difficultyFilter}
              onSetDifficulty={setDifficultyFilter}
              onBackClick={handleBackToUmbrella}
              onResetZoom={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Card / Category List drawers */}
      <AnimatePresence>
        {showCategoryList && selectedCategory && !selectedTopicId && (
          <TopicList
            category={selectedCategory}
            topics={topics.filter((t) => t.category === selectedCategory)}
            onTopicSelect={(id) => {
              setSelectedTopicId(id);
              setShowCategoryList(false);
            }}
            onClose={() => {
              setShowCategoryList(false);
              setSelectedCategory(null);
            }}
          />
        )}

        {selectedTopic && (
          <TopicCard
            topic={selectedTopic}
            allTopics={topics}
            relationships={relationships}
            resources={resources}
            onClose={handleCloseTopicCard}
            onTopicSelect={handleTopicSelect}
            onViewInGraph={handleViewInGraph}
            onExploreConnections={handleExploreConnections}
          />
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            topics={topics}
            onSelect={(id) => {
              handleTopicSelect(id);
              setSearchOpen(false);
            }}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
