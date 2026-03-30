"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Topic, Relationship, Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface GraphNode {
  id: string;
  name: string;
  category: Category;
  difficulty: string;
  importance: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: "prerequisite" | "related";
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphViewProps {
  topics: Topic[];
  relationships: Relationship[];
  highlightedNodeId: string | null;
  onNodeClick: (topicId: string) => void;
  categoryFilters: Set<Category>;
  difficultyFilter: string | null;
  resetZoomTrigger?: number;
}

export function GraphView({
  topics,
  relationships,
  highlightedNodeId,
  onNodeClick,
  categoryFilters,
  difficultyFilter,
  resetZoomTrigger,
}: GraphViewProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Build filtered graph data
  const graphData: GraphData = useMemo(() => {
    const filteredTopics = topics.filter((t) => {
      if (categoryFilters.size > 0 && !categoryFilters.has(t.category)) return false;
      if (difficultyFilter && t.difficulty !== difficultyFilter) return false;
      return true;
    });

    const nodeIds = new Set(filteredTopics.map((t) => t.id));

    const nodes: GraphNode[] = filteredTopics.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      difficulty: t.difficulty,
      importance: t.importance,
      color: CATEGORY_COLORS[t.category],
    }));

    const links: GraphLink[] = relationships
      .filter((r) => nodeIds.has(r.source) && nodeIds.has(r.target))
      .map((r) => ({ source: r.source, target: r.target, type: r.type }));

    return { nodes, links };
  }, [topics, relationships, categoryFilters, difficultyFilter]);

  // Compute connected nodes for highlight/hover
  const activeNodeId = hoveredNodeId ?? highlightedNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const connected = new Set<string>();
    graphData.links.forEach((link) => {
      const src = typeof link.source === "object" ? (link.source as any).id : link.source;
      const tgt = typeof link.target === "object" ? (link.target as any).id : link.target;
      if (src === activeNodeId) connected.add(tgt);
      if (tgt === activeNodeId) connected.add(src);
    });
    return connected;
  }, [activeNodeId, graphData.links]);

  // Reset zoom when trigger increments
  useEffect(() => {
    if (!resetZoomTrigger || !graphRef.current) return;
    graphRef.current.zoom(1, 500);
    graphRef.current.centerAt(0, 0, 500);
  }, [resetZoomTrigger]);

  // Center on highlighted node when it changes
  useEffect(() => {
    if (!highlightedNodeId || !graphRef.current) return;
    const timer = setTimeout(() => {
      const node = graphData.nodes.find((n) => n.id === highlightedNodeId);
      if (node && graphRef.current) {
        graphRef.current.centerAt((node as any).x, (node as any).y, 800);
        graphRef.current.zoom(2.5, 800);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [highlightedNodeId, graphData.nodes]);

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const { id, name, color, importance } = node;
      const radius = 3 + importance * 2;
      const isActive = id === activeNodeId;
      const isConnected = connectedNodeIds.has(id);
      const isDimmed = activeNodeId !== null && !isActive && !isConnected;

      // Glow for active/connected nodes
      if (isActive || isConnected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI);
        const glowColor = isActive ? color : color + "88";
        const grad = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius + 8);
        grad.addColorStop(0, glowColor);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isDimmed ? color + "33" : isActive ? color : color + "cc";
      ctx.fill();

      // Border for active
      if (isActive) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();
      }

      // Label when zoomed or hovered
      if (globalScale > 1.5 || id === hoveredNodeId || id === highlightedNodeId) {
        const label = name;
        const fontSize = Math.max(8, 12 / globalScale);
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isDimmed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.9)";
        ctx.fillText(label, node.x, node.y + radius + 2);
      }
    },
    [activeNodeId, connectedNodeIds, hoveredNodeId, highlightedNodeId]
  );

  const linkCanvasObject = useCallback(
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const src = link.source;
      const tgt = link.target;
      if (!src || !tgt || src.x == null || tgt.x == null) return;

      const srcId = typeof src === "object" ? src.id : src;
      const tgtId = typeof tgt === "object" ? tgt.id : tgt;

      const isConnectedToActive =
        activeNodeId !== null &&
        (srcId === activeNodeId || tgtId === activeNodeId);
      const isDimmed = activeNodeId !== null && !isConnectedToActive;

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);

      if (link.type === "related") {
        ctx.setLineDash([4 / globalScale, 4 / globalScale]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.strokeStyle = isDimmed
        ? "rgba(255,255,255,0.05)"
        : isConnectedToActive
        ? "rgba(255,255,255,0.6)"
        : "rgba(255,255,255,0.2)";
      ctx.lineWidth = isConnectedToActive ? 1.5 / globalScale : 1 / globalScale;
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow for prerequisite links
      if (link.type === "prerequisite" && !isDimmed) {
        const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
        const arrowLen = 6 / globalScale;
        const endX = tgt.x - Math.cos(angle) * (3 + (tgt.importance ?? 2) * 2 + 2);
        const endY = tgt.y - Math.sin(angle) * (3 + (tgt.importance ?? 2) * 2 + 2);

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLen * Math.cos(angle - Math.PI / 6),
          endY - arrowLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - arrowLen * Math.cos(angle + Math.PI / 6),
          endY - arrowLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = isConnectedToActive
          ? "rgba(255,255,255,0.6)"
          : "rgba(255,255,255,0.2)";
        ctx.fill();
      }
    },
    [activeNodeId]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{ background: "#0a0a0f" }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0f"
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => "replace"}
        linkCanvasObject={linkCanvasObject}
        linkCanvasObjectMode={() => "replace"}
        onNodeClick={(node: any) => onNodeClick(node.id)}
        onNodeHover={(node: any) => setHoveredNodeId(node ? node.id : null)}
        nodeLabel=""
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
