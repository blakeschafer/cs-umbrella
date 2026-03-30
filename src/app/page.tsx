"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ViewMode, Category, Topic, Relationship as RelType, Resource as ResType } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { Umbrella } from "@/components/umbrella/Umbrella";
import { GraphView } from "@/components/graph/GraphView";
import { GraphControls } from "@/components/graph/GraphControls";
import { TopicCard } from "@/components/topic/TopicCard";
import { SearchBar } from "@/components/SearchBar";
import topicsData from "@/data/topics.json";
import relationshipsData from "@/data/relationships.json";
import resourcesData from "@/data/resources.json";

const topics = topicsData as Topic[];
const relationships = relationshipsData as RelType[];
const resources = resourcesData as ResType[];

export default function Home() {
  const [view, setView] = useState<ViewMode>("umbrella");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Set<Category>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [resetZoomTrigger, setResetZoomTrigger] = useState(0);

  const selectedTopic = selectedTopicId
    ? topics.find((t) => t.id === selectedTopicId) ?? null
    : null;

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
  }, []);

  const handleExploreConnections = useCallback((topicId: string) => {
    setView("graph");
    setHighlightedNodeId(topicId);
    setSelectedTopicId(null);
  }, []);

  const handleViewInGraph = useCallback((topicId: string) => {
    setView("graph");
    setHighlightedNodeId(topicId);
    setSelectedTopicId(topicId);
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

  const handleViewChange = useCallback((newView: ViewMode) => {
    setView(newView);
    if (newView === "umbrella") {
      setHighlightedNodeId(null);
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar
        view={view}
        onViewChange={handleViewChange}
      />

      {/* Views */}
      <AnimatePresence mode="wait">
        {view === "umbrella" ? (
          <motion.div
            key="umbrella"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            <Umbrella
              topics={topics}
              onTopicClick={handleTopicSelect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            <GraphView
              topics={topics}
              relationships={relationships}
              highlightedNodeId={highlightedNodeId}
              onNodeClick={handleTopicSelect}
              categoryFilters={categoryFilters}
              difficultyFilter={difficultyFilter}
              resetZoomTrigger={resetZoomTrigger}
            />
            <GraphControls
              categoryFilters={categoryFilters}
              onToggleCategory={handleToggleCategory}
              difficultyFilter={difficultyFilter}
              onSetDifficulty={setDifficultyFilter}
              onResetZoom={() => setResetZoomTrigger((n) => n + 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Card drawer */}
      <AnimatePresence>
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

      {/* Search bar — fixed to bottom on both views */}
      <SearchBar
        topics={topics}
        onTopicSelect={handleTopicSelect}
      />
    </main>
  );
}
