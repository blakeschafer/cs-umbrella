"use client";

import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

interface UmbrellaPanelProps {
  category: Category;
  index: number;
  totalPanels: number;
  topicCount: number;
  isExpanded: boolean;
  onClick: (category: Category) => void;
}

const CX = 500;
const CY = 360;
const OUTER_R = 310;
const INNER_R = 30;
// Canopy spans from 5° to 175°
const START_DEG = 5;
const END_DEG = 175;

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

function buildArcPath(index: number, totalPanels: number) {
  const sweep = (END_DEG - START_DEG) / totalPanels;
  // Panels go left-to-right: index 0 starts at END_DEG (left side)
  const startAngle = END_DEG - index * sweep;
  const endAngle = startAngle - sweep;

  const outerStart = polarToCart(CX, CY, OUTER_R, startAngle);
  const outerEnd = polarToCart(CX, CY, OUTER_R, endAngle);
  const innerStart = polarToCart(CX, CY, INNER_R, startAngle);
  const innerEnd = polarToCart(CX, CY, INNER_R, endAngle);

  const midAngle = (startAngle + endAngle) / 2;
  const bulgeR = OUTER_R + 20;
  const bulgePoint = polarToCart(CX, CY, bulgeR, midAngle);

  const labelR = (OUTER_R + INNER_R) / 2 + 25;
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

export function UmbrellaPanel({
  category,
  index,
  totalPanels,
  topicCount,
  isExpanded,
  onClick,
}: UmbrellaPanelProps) {
  const color = CATEGORY_COLORS[category];
  const { path, labelPos, midAngle } = buildArcPath(index, totalPanels);
  const filterId = `glow-${index}`;

  // Text reads radially — pointing outward from center like a spoke
  // For left half (angle > 90°): text should read from outside toward center (rotate 180 so not upside down)
  // For right half (angle <= 90°): text reads from center outward
  const isLeftSide = midAngle > 90;
  const textRotation = isLeftSide
    ? round(-(midAngle - 180)) // flip so text reads left-to-right
    : round(-midAngle);

  // Shift label slightly outward for better centering in the panel
  const labelOuterR = (OUTER_R + INNER_R) / 2 + 30;
  const adjustedLabel = polarToCart(CX, CY, labelOuterR, midAngle);

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
        strokeWidth={isExpanded ? 2 : 1}
        filter={`url(#${filterId})`}
        initial={{ fillOpacity: 0.15, strokeOpacity: 0.4 }}
        animate={{
          fillOpacity: isExpanded ? 0.5 : [0.1, 0.2, 0.1],
          strokeOpacity: isExpanded ? 1 : 0.4,
          scale: isExpanded ? 1.06 : 1,
        }}
        transition={{
          fillOpacity: isExpanded
            ? { duration: 0.3 }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3, ease: "easeOut" },
          strokeOpacity: { duration: 0.3 },
        }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* Category label — reads radially outward like a spoke */}
      <text
        x={round(adjustedLabel.x)}
        y={round(adjustedLabel.y)}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isExpanded ? "#fff" : "rgba(255,255,255,0.7)"}
        fontSize={isExpanded ? 13 : 11}
        fontWeight={600}
        letterSpacing="0.02em"
        style={{ pointerEvents: "none", userSelect: "none" }}
        transform={`rotate(${textRotation}, ${round(adjustedLabel.x)}, ${round(adjustedLabel.y)})`}
      >
        {category}
      </text>

      {/* Topic count when expanded */}
      {isExpanded && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <text
            x={round(adjustedLabel.x)}
            y={round(adjustedLabel.y + 15)}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.45)"
            fontSize={9}
            fontWeight={400}
            style={{ pointerEvents: "none", userSelect: "none" }}
            transform={`rotate(${textRotation}, ${round(adjustedLabel.x)}, ${round(adjustedLabel.y + 15)})`}
          >
            {topicCount} topic{topicCount !== 1 ? "s" : ""}
          </text>
        </motion.g>
      )}
    </g>
  );
}
