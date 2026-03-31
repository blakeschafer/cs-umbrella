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
  const startAngle = END_DEG - index * sweep;
  const endAngle = startAngle - sweep;

  const outerStart = polarToCart(CX, CY, OUTER_R, startAngle);
  const outerEnd = polarToCart(CX, CY, OUTER_R, endAngle);
  const innerStart = polarToCart(CX, CY, INNER_R, startAngle);
  const innerEnd = polarToCart(CX, CY, INNER_R, endAngle);

  const midAngle = (startAngle + endAngle) / 2;
  const bulgeR = OUTER_R + 20;
  const bulgePoint = polarToCart(CX, CY, bulgeR, midAngle);

  const path = [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `Q ${bulgePoint.x} ${bulgePoint.y} ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 0 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");

  return { path, midAngle: round(midAngle), sweep };
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
  const { path, midAngle, sweep } = buildArcPath(index, totalPanels);
  const filterId = `glow-${index}`;

  // Text reads radially — sideways like a spoke
  const isLeftSide = midAngle > 90;
  const textRotation = isLeftSide
    ? round(-(midAngle - 180))
    : round(-midAngle);

  // Place text at center of the petal (between inner and outer radius)
  const labelR = (OUTER_R + INNER_R) / 2 + 15;
  const labelPos = polarToCart(CX, CY, labelR, midAngle);

  // Calculate how much radial space we have (distance from inner to outer)
  const radialSpace = OUTER_R - INNER_R - 20; // ~260px available

  // Scale font size to fill the petal: longer names get smaller text
  // The "width" of the petal at the label radius constrains us too
  const petalWidth = degToRad(sweep) * labelR; // arc width at label position
  const maxFontByWidth = (petalWidth * 0.85) / 1; // constrain by width (single line height)
  const maxFontByLength = (radialSpace * 0.75) / category.length; // constrain by text length
  const fontSize = round(Math.max(12, Math.min(22, maxFontByWidth, maxFontByLength * 1.6)));

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

      {/* Category label — big, sideways, filling the petal */}
      <text
        x={round(labelPos.x)}
        y={round(labelPos.y)}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isExpanded ? "#fff" : "rgba(255,255,255,0.85)"}
        fontSize={isExpanded ? fontSize + 2 : fontSize}
        fontWeight={800}
        letterSpacing="0.04em"
        style={{ pointerEvents: "none", userSelect: "none", textTransform: "uppercase" }}
        transform={`rotate(${textRotation}, ${round(labelPos.x)}, ${round(labelPos.y)})`}
      >
        {category}
      </text>

      {/* Topic count below label when expanded */}
      {isExpanded && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {(() => {
            const countR = labelR + fontSize * 0.8 + 8;
            const countPos = polarToCart(CX, CY, countR, midAngle);
            return (
              <text
                x={round(countPos.x)}
                y={round(countPos.y)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.5)"
                fontSize={10}
                fontWeight={500}
                style={{ pointerEvents: "none", userSelect: "none" }}
                transform={`rotate(${textRotation}, ${round(countPos.x)}, ${round(countPos.y)})`}
              >
                {topicCount} topics
              </text>
            );
          })()}
        </motion.g>
      )}
    </g>
  );
}
