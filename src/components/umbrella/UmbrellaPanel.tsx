"use client";

import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

interface UmbrellaPanelProps {
  category: Category;
  index: number;
  topicCount: number;
  isExpanded: boolean;
  onHover: (category: Category | null) => void;
  onClick: (category: Category) => void;
}

const CX = 400;
const CY = 280;
const OUTER_R = 220;
const INNER_R = 30;
const TOTAL_PANELS = 8;
// Canopy spans from 15° to 165° — a wide arc across the top
const START_DEG = 15;
const END_DEG = 165;
const SWEEP = (END_DEG - START_DEG) / TOTAL_PANELS;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

const round = (n: number) => Math.round(n * 10000) / 10000;

function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg);
  // Standard math: 0°=right, 90°=up. SVG y is inverted, so subtract sin.
  return {
    x: round(cx + r * Math.cos(rad)),
    y: round(cy - r * Math.sin(rad)),
  };
}

function buildArcPath(index: number) {
  // Panels go left-to-right, so index 0 starts at END_DEG (left side)
  // and index 7 ends at START_DEG (right side)
  const startAngle = END_DEG - index * SWEEP;
  const endAngle = startAngle - SWEEP;

  const outerStart = polarToCart(CX, CY, OUTER_R, startAngle);
  const outerEnd = polarToCart(CX, CY, OUTER_R, endAngle);
  const innerStart = polarToCart(CX, CY, INNER_R, startAngle);
  const innerEnd = polarToCart(CX, CY, INNER_R, endAngle);

  // Bulge outward for canopy curve
  const midAngle = (startAngle + endAngle) / 2;
  const bulgeR = OUTER_R + 20;
  const bulgePoint = polarToCart(CX, CY, bulgeR, midAngle);

  const labelR = (OUTER_R + INNER_R) / 2 + 15;
  const labelPos = polarToCart(CX, CY, labelR, midAngle);

  // SVG large-arc-flag: 0 since each panel < 180°
  const path = [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `Q ${bulgePoint.x} ${bulgePoint.y} ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 0 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");

  return {
    path,
    labelPos,
    midAngle: round(midAngle),
  };
}

export function UmbrellaPanel({ category, index, topicCount, isExpanded, onHover, onClick }: UmbrellaPanelProps) {
  const color = CATEGORY_COLORS[category];
  const { path, labelPos, midAngle } = buildArcPath(index);
  const filterId = `glow-${index}`;

  // Rotate label so text reads along the arc, keeping it readable
  // For panels on the left side (angle > 90), flip so text isn't upside down
  let labelRotation = 90 - midAngle;
  if (midAngle > 90) {
    labelRotation = 90 - midAngle;
  }

  return (
    <g
      onClick={() => onClick(category)}
      onMouseEnter={() => onHover(category)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isExpanded ? 8 : 0} result="blur" />
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
        strokeWidth={1.5}
        filter={`url(#${filterId})`}
        initial={{ fillOpacity: 0.15, strokeOpacity: 0.6 }}
        animate={{
          fillOpacity: isExpanded ? 0.45 : [0.12, 0.2, 0.12],
          strokeOpacity: isExpanded ? 1 : 0.6,
          scale: isExpanded ? 1.04 : 1,
        }}
        transition={{
          fillOpacity: isExpanded ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.25, ease: "easeOut" },
        }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* Category label */}
      <text
        x={round(labelPos.x)}
        y={round(labelPos.y)}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isExpanded ? "#fff" : "rgba(255,255,255,0.8)"}
        fontSize={isExpanded ? 12 : 10.5}
        fontWeight={600}
        style={{ pointerEvents: "none", userSelect: "none" }}
        transform={`rotate(${round(labelRotation)}, ${round(labelPos.x)}, ${round(labelPos.y)})`}
      >
        {category}
      </text>

      {/* Topic count on hover */}
      {isExpanded && (
        <motion.text
          x={round(labelPos.x)}
          y={round(labelPos.y + 14)}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.6)"
          fontSize={9}
          fontWeight={400}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ pointerEvents: "none", userSelect: "none" }}
          transform={`rotate(${round(labelRotation)}, ${round(labelPos.x)}, ${round(labelPos.y + 14)})`}
        >
          {topicCount} topic{topicCount !== 1 ? "s" : ""}
        </motion.text>
      )}
    </g>
  );
}
