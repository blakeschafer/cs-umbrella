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
const CY = 300;
const OUTER_R = 250;
const INNER_R = 40;
const TOTAL_PANELS = 8;
const START_DEG = -70;
const END_DEG = 110;
const SWEEP = (END_DEG - START_DEG) / TOTAL_PANELS;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg);
  const round = (n: number) => Math.round(n * 10000) / 10000;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy - r * Math.sin(rad)) };
}

function buildArcPath(index: number) {
  const startAngle = START_DEG + index * SWEEP;
  const endAngle = startAngle + SWEEP;

  const outerStart = polarToCart(CX, CY, OUTER_R, startAngle);
  const outerEnd = polarToCart(CX, CY, OUTER_R, endAngle);
  const innerStart = polarToCart(CX, CY, INNER_R, endAngle);
  const innerEnd = polarToCart(CX, CY, INNER_R, startAngle);

  const midAngle = (startAngle + endAngle) / 2;
  const bulgeR = OUTER_R + 18;
  const midPoint = polarToCart(CX, CY, bulgeR, midAngle);

  const labelPos = polarToCart(CX, CY, (OUTER_R + INNER_R) / 2 + 20, midAngle);

  return {
    path: [
      `M ${innerEnd.x} ${innerEnd.y}`,
      `L ${outerStart.x} ${outerStart.y}`,
      `Q ${midPoint.x} ${midPoint.y} ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${INNER_R} ${INNER_R} 0 0 0 ${innerEnd.x} ${innerEnd.y}`,
      "Z",
    ].join(" "),
    labelPos,
    midAngle: Math.round(midAngle * 10000) / 10000,
  };
}

export function UmbrellaPanel({ category, index, topicCount, isExpanded, onHover, onClick }: UmbrellaPanelProps) {
  const color = CATEGORY_COLORS[category];
  const { path, labelPos, midAngle } = buildArcPath(index);
  const filterId = `glow-${index}`;

  const labelRotation = -midAngle;

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
        initial={{ fillOpacity: 0.12, strokeOpacity: 0.6 }}
        animate={{
          fillOpacity: isExpanded ? 0.4 : [0.12, 0.18, 0.12],
          strokeOpacity: isExpanded ? 1 : 0.6,
          scale: isExpanded ? 1.05 : 1,
        }}
        transition={{
          fillOpacity: isExpanded ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.25, ease: "easeOut" },
        }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* Category label */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isExpanded ? "#fff" : "rgba(255,255,255,0.8)"}
        fontSize={isExpanded ? 12 : 11}
        fontWeight={600}
        style={{ pointerEvents: "none", userSelect: "none" }}
        transform={`rotate(${labelRotation}, ${labelPos.x}, ${labelPos.y})`}
      >
        {category}
      </text>

      {/* Topic count on hover */}
      {isExpanded && (
        <motion.text
          x={labelPos.x}
          y={labelPos.y + 16}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.6)"
          fontSize={10}
          fontWeight={400}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ pointerEvents: "none", userSelect: "none" }}
          transform={`rotate(${labelRotation}, ${labelPos.x}, ${labelPos.y + 16})`}
        >
          {topicCount} topic{topicCount !== 1 ? "s" : ""}
        </motion.text>
      )}
    </g>
  );
}
