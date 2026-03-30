"use client";

import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

interface UmbrellaPanelProps {
  category: Category;
  index: number;
  topicCount: number;
  isExpanded: boolean;
  onClick: (category: Category) => void;
}

const CX = 500;
const CY = 340;
const OUTER_R = 300;
const INNER_R = 35;
const TOTAL_PANELS = 8;
// Canopy spans from 10° to 170° — wide arc across the top
const START_DEG = 10;
const END_DEG = 170;
const SWEEP = (END_DEG - START_DEG) / TOTAL_PANELS;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

const round = (n: number) => Math.round(n * 10000) / 10000;

function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg);
  return {
    x: round(cx + r * Math.cos(rad)),
    y: round(cy - r * Math.sin(rad)),
  };
}

function buildArcPath(index: number) {
  // Panels go left-to-right: index 0 starts at END_DEG (left side)
  const startAngle = END_DEG - index * SWEEP;
  const endAngle = startAngle - SWEEP;

  const outerStart = polarToCart(CX, CY, OUTER_R, startAngle);
  const outerEnd = polarToCart(CX, CY, OUTER_R, endAngle);
  const innerStart = polarToCart(CX, CY, INNER_R, startAngle);
  const innerEnd = polarToCart(CX, CY, INNER_R, endAngle);

  const midAngle = (startAngle + endAngle) / 2;
  const bulgeR = OUTER_R + 25;
  const bulgePoint = polarToCart(CX, CY, bulgeR, midAngle);

  const labelR = (OUTER_R + INNER_R) / 2 + 20;
  const labelPos = polarToCart(CX, CY, labelR, midAngle);

  const path = [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `Q ${bulgePoint.x} ${bulgePoint.y} ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 0 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");

  return { path, labelPos, midAngle: round(midAngle) };
}

export { CX, CY };

export function UmbrellaPanel({ category, index, topicCount, isExpanded, onClick }: UmbrellaPanelProps) {
  const color = CATEGORY_COLORS[category];
  const { path, labelPos, midAngle } = buildArcPath(index);
  const filterId = `glow-${index}`;

  // Rotate labels so text is readable
  const labelRotation = 90 - midAngle;

  return (
    <g
      onClick={() => onClick(category)}
      style={{ cursor: "pointer" }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isExpanded ? 10 : 0} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={path}
        fill={color}
        stroke={color}
        strokeWidth={isExpanded ? 2 : 1.5}
        filter={`url(#${filterId})`}
        initial={{ fillOpacity: 0.15, strokeOpacity: 0.5 }}
        animate={{
          fillOpacity: isExpanded ? 0.5 : [0.12, 0.2, 0.12],
          strokeOpacity: isExpanded ? 1 : 0.5,
          scale: isExpanded ? 1.06 : 1,
        }}
        transition={{
          fillOpacity: isExpanded ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3, ease: "easeOut" },
          strokeOpacity: { duration: 0.3 },
        }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* Category label */}
      <text
        x={round(labelPos.x)}
        y={round(labelPos.y)}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isExpanded ? "#fff" : "rgba(255,255,255,0.75)"}
        fontSize={isExpanded ? 14 : 12}
        fontWeight={600}
        style={{ pointerEvents: "none", userSelect: "none" }}
        transform={`rotate(${round(labelRotation)}, ${round(labelPos.x)}, ${round(labelPos.y)})`}
      >
        {category}
      </text>

      {/* Topic count */}
      {isExpanded && (
        <motion.text
          x={round(labelPos.x)}
          y={round(labelPos.y + 16)}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.5)"
          fontSize={10}
          fontWeight={400}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ pointerEvents: "none", userSelect: "none" }}
          transform={`rotate(${round(labelRotation)}, ${round(labelPos.x)}, ${round(labelPos.y + 16)})`}
        >
          {topicCount} topic{topicCount !== 1 ? "s" : ""}
        </motion.text>
      )}
    </g>
  );
}
