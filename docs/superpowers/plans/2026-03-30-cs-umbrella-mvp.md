# CS Umbrella MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive Next.js app that maps computer science into a connected, explorable graph with a signature umbrella homepage visualization.

**Architecture:** Single-page Next.js 15 app with three views (umbrella, graph, topic card) managed by React state. Static JSON data for ~75 CS topics. Custom SVG umbrella with Framer Motion animations, react-force-graph-2d for graph exploration, fuse.js for search.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, react-force-graph-2d, fuse.js

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/blakeschafer/Desktop/projects/cs-umbrella
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This creates the full Next.js scaffolding with Tailwind v4.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion react-force-graph-2d fuse.js
npm install -D @types/react @types/node
```

- [ ] **Step 3: Set up globals.css with dark theme custom properties**

Replace the contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg: #0a0a0f;
  --surface: #141420;
  --border: #1e1e2e;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;

  --color-algorithms: #22d3ee;
  --color-data-structures: #a78bfa;
  --color-ai-ml: #f472b6;
  --color-systems: #fb923c;
  --color-web-dev: #4ade80;
  --color-networking: #60a5fa;
  --color-security: #f87171;
  --color-databases: #facc15;
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
```

- [ ] **Step 4: Set up root layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "CS Umbrella",
  description: "Explore the entire field of computer science — visually connected",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Set up placeholder page**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">
        CS Umbrella
      </h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: App runs at localhost:3000, shows "CS Umbrella" centered on dark background.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with Tailwind and dependencies"
```

---

### Task 2: Types, Constants, and Data Layer

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`
- Create: `src/data/topics.json`
- Create: `src/data/relationships.json`
- Create: `src/data/resources.json`

- [ ] **Step 1: Create TypeScript types**

Create `src/lib/types.ts`:

```ts
export type Category =
  | "Algorithms"
  | "Data Structures"
  | "AI / ML"
  | "Systems"
  | "Web Dev"
  | "Networking"
  | "Security"
  | "Databases";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Topic {
  id: string;
  name: string;
  category: Category;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  importance: number; // 1-5
}

export interface Relationship {
  source: string;
  target: string;
  type: "prerequisite" | "related";
}

export interface Resource {
  topicId: string;
  title: string;
  url: string;
  type: "article" | "video" | "course";
  source: string;
}

export type ViewMode = "umbrella" | "graph";
```

- [ ] **Step 2: Create constants**

Create `src/lib/constants.ts`:

```ts
import { Category } from "./types";

export const CATEGORY_COLORS: Record<Category, string> = {
  "Algorithms": "#22d3ee",
  "Data Structures": "#a78bfa",
  "AI / ML": "#f472b6",
  "Systems": "#fb923c",
  "Web Dev": "#4ade80",
  "Networking": "#60a5fa",
  "Security": "#f87171",
  "Databases": "#facc15",
};

export const CATEGORIES: Category[] = [
  "Algorithms",
  "Data Structures",
  "AI / ML",
  "Systems",
  "Web Dev",
  "Networking",
  "Security",
  "Databases",
];

export const DIFFICULTY_COLORS: Record<string, string> = {
  "Beginner": "#4ade80",
  "Intermediate": "#facc15",
  "Advanced": "#f87171",
};
```

- [ ] **Step 3: Create seed data — topics.json**

Create `src/data/topics.json` with ~75 topics across all 8 categories. Each topic needs id, name, category, description, difficulty, tags, importance.

Generate a comprehensive dataset covering:
- **Algorithms (10):** Big O Notation, Sorting Algorithms, Search Algorithms, Graph Algorithms, Dynamic Programming, Greedy Algorithms, Divide and Conquer, Recursion, Backtracking, Hashing
- **Data Structures (10):** Arrays, Linked Lists, Stacks, Queues, Hash Tables, Binary Trees, Heaps, Graphs, Tries, Binary Search Trees
- **AI / ML (10):** Machine Learning, Neural Networks, Deep Learning, Natural Language Processing, Computer Vision, Reinforcement Learning, Supervised Learning, Unsupervised Learning, Decision Trees, Clustering
- **Systems (9):** Operating Systems, Compilers, Memory Management, Process Scheduling, File Systems, Virtual Machines, Distributed Systems, Concurrency, CPU Architecture
- **Web Dev (9):** HTML/CSS, JavaScript, HTTP Protocol, REST APIs, Frontend Frameworks, Backend Development, Web Security, Responsive Design, Web Performance
- **Networking (9):** TCP/IP, DNS, Routing, Network Security, Firewalls, OSI Model, Wireless Networks, Load Balancing, Sockets
- **Security (9):** Cryptography, Encryption, Authentication, Access Control, Penetration Testing, Malware Analysis, Network Security Fundamentals, Secure Coding, Public Key Infrastructure
- **Databases (9):** SQL, Relational Databases, NoSQL, Database Indexing, Transactions, Normalization, Query Optimization, Data Modeling, Database Replication

Full JSON file content — each entry follows this format:
```json
{
  "id": "big_o_notation",
  "name": "Big O Notation",
  "category": "Algorithms",
  "description": "A mathematical notation that describes the upper bound of an algorithm's time or space complexity. It helps compare how algorithms scale as input size grows.",
  "difficulty": "Beginner",
  "tags": ["complexity", "analysis", "performance"],
  "importance": 5
}
```

The full ~75 topic dataset should be generated as a complete JSON array. Every topic must have a unique id (snake_case), a 2-3 sentence beginner-friendly description, appropriate difficulty, relevant tags, and importance 1-5 (where 5 = foundational concept, 1 = niche).

- [ ] **Step 4: Create seed data — relationships.json**

Create `src/data/relationships.json` with meaningful connections between topics. Aim for ~120 relationships total.

Types:
- `"prerequisite"`: source must be understood before target (directional)
- `"related"`: topics share concepts (bidirectional conceptually, stored once)

Key relationship patterns:
- Arrays → Linked Lists → Stacks/Queues (prerequisite chain)
- Big O Notation → all other Algorithms topics (prerequisite)
- HTML/CSS → JavaScript → Frontend Frameworks (prerequisite chain)
- SQL → Relational Databases → Normalization (prerequisite chain)
- Machine Learning → Neural Networks → Deep Learning (prerequisite chain)
- Cryptography ↔ Network Security (related)
- Graph Algorithms ↔ Graphs data structure (related)
- Operating Systems → Memory Management, Process Scheduling, File Systems (prerequisite)

Format:
```json
[
  { "source": "big_o_notation", "target": "sorting_algorithms", "type": "prerequisite" },
  { "source": "arrays", "target": "linked_lists", "type": "prerequisite" },
  { "source": "graph_algorithms", "target": "graphs", "type": "related" }
]
```

- [ ] **Step 5: Create seed data — resources.json**

Create `src/data/resources.json` with 2-3 resources per topic (a mix of articles, videos, courses). Use real, well-known educational URLs.

Format:
```json
[
  {
    "topicId": "big_o_notation",
    "title": "Big O Notation - Full Course",
    "url": "https://www.youtube.com/watch?v=Mo4vesaut8g",
    "type": "video",
    "source": "freeCodeCamp"
  }
]
```

Use sources like: freeCodeCamp (YouTube), GeeksforGeeks, MDN Web Docs, Khan Academy, MIT OpenCourseWare, Coursera, Wikipedia, Computerphile (YouTube).

- [ ] **Step 6: Commit**

```bash
git add src/lib/ src/data/
git commit -m "feat: add types, constants, and seed data for 75 CS topics"
```

---

### Task 3: Shared UI Components

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Button.tsx`

- [ ] **Step 1: Create Badge component**

Create `src/components/ui/Badge.tsx`:

```tsx
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/constants";
import { Category, Difficulty } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category }) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {category}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const color = DIFFICULTY_COLORS[difficulty];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {difficulty}
    </span>
  );
}
```

- [ ] **Step 2: Create Button component**

Create `src/components/ui/Button.tsx`:

```tsx
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:brightness-125",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Badge and Button shared UI components"
```

---

### Task 4: View State Management and Page Shell

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build the main page with view state**

Replace `src/app/page.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ViewMode, Category, Topic } from "@/lib/types";
import topics from "@/data/topics.json";
import relationships from "@/data/relationships.json";
import resources from "@/data/resources.json";
import { Topic as TopicType } from "@/lib/types";

const typedTopics = topics as TopicType[];

export default function Home() {
  const [view, setView] = useState<ViewMode>("umbrella");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const selectedTopic = selectedTopicId
    ? typedTopics.find((t) => t.id === selectedTopicId) ?? null
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

  const handleBackToUmbrella = useCallback(() => {
    setView("umbrella");
    setHighlightedNodeId(null);
  }, []);

  const handleCloseTopicCard = useCallback(() => {
    setSelectedTopicId(null);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Views render here — Tasks 5-8 will add components */}
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
            {/* Umbrella component goes here (Task 5) */}
            <div className="flex min-h-screen items-center justify-center">
              <p className="text-[var(--text-secondary)]">Umbrella View</p>
            </div>
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
            {/* Graph component goes here (Task 6) */}
            <div className="flex min-h-screen items-center justify-center">
              <p className="text-[var(--text-secondary)]">Graph View</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Card drawer goes here (Task 7) */}
      {/* Search overlay goes here (Task 8) */}
    </main>
  );
}
```

- [ ] **Step 2: Verify it compiles and renders**

```bash
npm run dev
```

Expected: Dark page shows "Umbrella View" text. No errors in console.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add view state management and page shell"
```

---

### Task 5: Umbrella Homepage Visualization

**Files:**
- Create: `src/components/umbrella/UmbrellaPanel.tsx`
- Create: `src/components/umbrella/Umbrella.tsx`
- Create: `src/components/umbrella/RainEffect.tsx`
- Modify: `src/app/page.tsx` (wire in umbrella)

- [ ] **Step 1: Create UmbrellaPanel component**

Create `src/components/umbrella/UmbrellaPanel.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

interface UmbrellaPanelProps {
  category: Category;
  index: number;
  topicCount: number;
  onClick: (category: Category) => void;
}

export function UmbrellaPanel({ category, index, topicCount, onClick }: UmbrellaPanelProps) {
  const [hovered, setHovered] = useState(false);
  const color = CATEGORY_COLORS[category];
  const totalPanels = 8;

  // Each panel is a curved section of the umbrella canopy
  // The umbrella spans from roughly -60deg to 240deg (180 degrees of arc)
  const startAngle = -70 + (index * 180) / totalPanels;
  const endAngle = -70 + ((index + 1) * 180) / totalPanels;
  const midAngle = (startAngle + endAngle) / 2;

  const cx = 400; // center x
  const cy = 300; // center y (top of pole)
  const outerRadius = 250;
  const innerRadius = 40;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const outerStart = {
    x: cx + outerRadius * Math.cos(toRad(startAngle)),
    y: cy + outerRadius * Math.sin(toRad(startAngle)),
  };
  const outerEnd = {
    x: cx + outerRadius * Math.cos(toRad(endAngle)),
    y: cy + outerRadius * Math.sin(toRad(endAngle)),
  };
  const innerStart = {
    x: cx + innerRadius * Math.cos(toRad(startAngle)),
    y: cy + innerRadius * Math.sin(toRad(startAngle)),
  };
  const innerEnd = {
    x: cx + innerRadius * Math.cos(toRad(endAngle)),
    y: cy + innerRadius * Math.sin(toRad(endAngle)),
  };

  // SVG arc path: outer arc forward, line to inner end, inner arc backward, close
  const path = [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");

  // Tooltip position: along the middle of the outer arc
  const tooltipPos = {
    x: cx + (outerRadius + 30) * Math.cos(toRad(midAngle)),
    y: cy + (outerRadius + 30) * Math.sin(toRad(midAngle)),
  };

  // Label position: middle of the panel
  const labelRadius = (outerRadius + innerRadius) / 2;
  const labelPos = {
    x: cx + labelRadius * Math.cos(toRad(midAngle)),
    y: cy + labelRadius * Math.sin(toRad(midAngle)),
  };

  const filterId = `glow-${index}`;

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(category)}
      className="cursor-pointer"
    >
      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation={hovered ? 8 : 4} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={path}
        fill={color}
        fillOpacity={hovered ? 0.35 : 0.15}
        stroke={color}
        strokeWidth={hovered ? 2 : 1}
        strokeOpacity={hovered ? 1 : 0.5}
        filter={`url(#${filterId})`}
        animate={{
          fillOpacity: hovered ? 0.35 : 0.15,
          scale: hovered ? 1.03 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Category label */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={11}
        fontWeight={600}
        className="pointer-events-none select-none"
        opacity={hovered ? 1 : 0.8}
      >
        {category}
      </text>

      {/* Hover tooltip */}
      {hovered && (
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <rect
            x={tooltipPos.x - 60}
            y={tooltipPos.y - 14}
            width={120}
            height={28}
            rx={6}
            fill="#141420"
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.5}
          />
          <text
            x={tooltipPos.x}
            y={tooltipPos.y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize={11}
            className="pointer-events-none"
          >
            {topicCount} topics
          </text>
        </motion.g>
      )}
    </g>
  );
}
```

- [ ] **Step 2: Create RainEffect component**

Create `src/components/umbrella/RainEffect.tsx`:

```tsx
"use client";

import { useRef, useEffect } from "react";

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Raindrop[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize drops
    const dropCount = 80;
    dropsRef.current = Array.from({ length: dropCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 2,
      length: 10 + Math.random() * 20,
      opacity: 0.05 + Math.random() * 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const drop of dropsRef.current) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(100, 150, 255, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
```

- [ ] **Step 3: Create main Umbrella component**

Create `src/components/umbrella/Umbrella.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Category, Topic } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { UmbrellaPanel } from "./UmbrellaPanel";
import { RainEffect } from "./RainEffect";

interface UmbrellaProps {
  topics: Topic[];
  onCategoryClick: (category: Category) => void;
  onExploreClick: () => void;
  onSearchClick: () => void;
}

export function Umbrella({ topics, onCategoryClick, onExploreClick, onSearchClick }: UmbrellaProps) {
  const topicCountByCategory = (cat: Category) =>
    topics.filter((t) => t.category === cat).length;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <RainEffect />

      <div className="relative z-10 flex flex-col items-center">
        {/* SVG Umbrella */}
        <motion.svg
          viewBox="0 0 800 500"
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Panels */}
          {CATEGORIES.map((cat, i) => (
            <UmbrellaPanel
              key={cat}
              category={cat}
              index={i}
              topicCount={topicCountByCategory(cat)}
              onClick={onCategoryClick}
            />
          ))}

          {/* Pole */}
          <line
            x1={400}
            y1={300}
            x2={400}
            y2={440}
            stroke="#94a3b8"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Handle (J-hook) */}
          <path
            d="M 400 440 Q 400 460, 385 460 Q 370 460, 370 445"
            fill="none"
            stroke="#94a3b8"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Top tip */}
          <circle cx={400} cy={50} r={4} fill="#94a3b8" />
          <line x1={400} y1={50} x2={400} y2={60} stroke="#94a3b8" strokeWidth={2} />
        </motion.svg>

        {/* Title and tagline */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            CS Umbrella
          </h1>
          <p className="mt-3 text-lg text-[var(--text-secondary)]">
            Explore the entire field of computer science — visually connected
          </p>
        </motion.div>

        {/* Action row */}
        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search topics...
            <kbd className="ml-2 rounded border border-[var(--border)] px-1.5 py-0.5 text-xs">⌘K</kbd>
          </button>

          <button
            onClick={onExploreClick}
            className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-white/20"
          >
            Explore Graph →
          </button>
        </motion.div>

        <motion.p
          className="mt-6 text-sm text-[var(--text-secondary)] opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Click a topic on the umbrella to begin
        </motion.p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire Umbrella into page.tsx**

Update `src/app/page.tsx` — replace the umbrella placeholder div with:

```tsx
import { Umbrella } from "@/components/umbrella/Umbrella";
```

And in the umbrella view motion.div, replace the placeholder with:

```tsx
<Umbrella
  topics={typedTopics}
  onCategoryClick={(category) => {
    setSelectedCategory(category);
    // Select the first topic of that category to show the topic list
    const firstTopic = typedTopics.find((t) => t.category === category);
    if (firstTopic) setSelectedTopicId(firstTopic.id);
  }}
  onExploreClick={() => setView("graph")}
  onSearchClick={() => setSearchOpen(true)}
/>
```

- [ ] **Step 5: Verify umbrella renders**

```bash
npm run dev
```

Expected: Dark page with rain animation, SVG umbrella with 8 colored panels, title, tagline, search bar, and explore button. Panels highlight on hover.

- [ ] **Step 6: Commit**

```bash
git add src/components/umbrella/ src/app/page.tsx
git commit -m "feat: add umbrella homepage with animated panels and rain effect"
```

---

### Task 6: Graph View

**Files:**
- Create: `src/components/graph/GraphView.tsx`
- Create: `src/components/graph/GraphControls.tsx`
- Modify: `src/app/page.tsx` (wire in graph)

- [ ] **Step 1: Create GraphView component**

Create `src/components/graph/GraphView.tsx`:

```tsx
"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { Topic, Relationship, Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

// Dynamic import needed because react-force-graph-2d uses canvas/window
import dynamic from "next/dynamic";
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface GraphNode {
  id: string;
  name: string;
  category: Category;
  importance: number;
  color: string;
  // react-force-graph adds x, y, vx, vy at runtime
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: "prerequisite" | "related";
}

interface GraphViewProps {
  topics: Topic[];
  relationships: Relationship[];
  highlightedNodeId: string | null;
  onNodeClick: (topicId: string) => void;
  onBackClick: () => void;
}

export function GraphView({
  topics,
  relationships,
  highlightedNodeId,
  onNodeClick,
  onBackClick,
}: GraphViewProps) {
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [categoryFilters, setCategoryFilters] = useState<Set<Category>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Center on highlighted node
  useEffect(() => {
    if (highlightedNodeId && graphRef.current) {
      setTimeout(() => {
        const node = graphRef.current?.graphData?.().nodes.find(
          (n: GraphNode) => n.id === highlightedNodeId
        );
        if (node) {
          graphRef.current.centerAt(node.x, node.y, 500);
          graphRef.current.zoom(3, 500);
        }
      }, 500);
    }
  }, [highlightedNodeId]);

  // Build graph data with filters applied
  const filteredTopics = topics.filter((t) => {
    if (categoryFilters.size > 0 && !categoryFilters.has(t.category)) return false;
    if (difficultyFilter && t.difficulty !== difficultyFilter) return false;
    return true;
  });

  const filteredIds = new Set(filteredTopics.map((t) => t.id));

  const graphData = {
    nodes: filteredTopics.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      importance: t.importance,
      color: CATEGORY_COLORS[t.category],
    })),
    links: relationships
      .filter((r) => filteredIds.has(r.source) && filteredIds.has(r.target))
      .map((r) => ({
        source: r.source,
        target: r.target,
        type: r.type,
      })),
  };

  // Get connected node ids for highlighting
  const getConnectedIds = useCallback(
    (nodeId: string) => {
      const connected = new Set<string>();
      connected.add(nodeId);
      relationships.forEach((r) => {
        if (r.source === nodeId) connected.add(r.target);
        if (r.target === nodeId) connected.add(r.source);
      });
      return connected;
    },
    [relationships]
  );

  const activeNodeId = hoveredNode || highlightedNodeId;
  const connectedIds = activeNodeId ? getConnectedIds(activeNodeId) : null;

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const size = 3 + node.importance * 2;
      const isConnected = connectedIds ? connectedIds.has(node.id) : true;
      const isActive = node.id === activeNodeId;
      const alpha = connectedIds ? (isConnected ? 1 : 0.15) : 0.8;

      // Glow for active/connected nodes
      if (isActive || (connectedIds && isConnected)) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}30`;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle =
        alpha < 1
          ? node.color + Math.round(alpha * 255).toString(16).padStart(2, "0")
          : node.color;
      ctx.fill();

      // Label (only when zoomed in enough or hovered)
      if (globalScale > 1.5 || isActive) {
        ctx.font = `${11 / globalScale}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
        ctx.fillText(node.name, node.x, node.y + size + 3);
      }
    },
    [connectedIds, activeNodeId]
  );

  const linkCanvasObject = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      const isConnected =
        connectedIds && (connectedIds.has(sourceId) || connectedIds.has(targetId));
      const alpha = connectedIds ? (isConnected ? 0.6 : 0.05) : 0.15;

      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.strokeStyle = `rgba(100, 100, 140, ${alpha})`;
      ctx.lineWidth = link.type === "prerequisite" ? 1.5 : 0.8;

      if (link.type === "related") {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow for prerequisite links
      if (link.type === "prerequisite" && alpha > 0.1) {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const angle = Math.atan2(dy, dx);
        const targetSize = 3 + (link.target.importance || 3) * 2;
        const arrowX = link.target.x - Math.cos(angle) * (targetSize + 3);
        const arrowY = link.target.y - Math.sin(angle) * (targetSize + 3);
        const arrowLen = 6;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLen * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLen * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.strokeStyle = `rgba(100, 100, 140, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [connectedIds]
  );

  return (
    <div className="relative h-screen w-screen">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0f"
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeClick={(node: any) => onNodeClick(node.id)}
        onNodeHover={(node: any) => setHoveredNode(node?.id ?? null)}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          const size = 3 + node.importance * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />

      {/* Controls overlay — handled by GraphControls in next step */}
    </div>
  );
}
```

- [ ] **Step 2: Create GraphControls component**

Create `src/components/graph/GraphControls.tsx`:

```tsx
"use client";

import { Category, Difficulty } from "@/lib/types";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface GraphControlsProps {
  categoryFilters: Set<Category>;
  onToggleCategory: (category: Category) => void;
  difficultyFilter: string | null;
  onSetDifficulty: (difficulty: string | null) => void;
  onBackClick: () => void;
  onResetZoom: () => void;
}

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export function GraphControls({
  categoryFilters,
  onToggleCategory,
  difficultyFilter,
  onSetDifficulty,
  onBackClick,
  onResetZoom,
}: GraphControlsProps) {
  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col gap-3">
      <Button variant="ghost" size="sm" onClick={onBackClick}>
        ← Back to Umbrella
      </Button>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">Categories</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = categoryFilters.size === 0 || categoryFilters.has(cat);
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className="rounded-full px-2 py-1 text-xs font-medium transition-all"
                style={{
                  backgroundColor: active ? `${color}20` : "transparent",
                  color: active ? color : "var(--text-secondary)",
                  border: `1px solid ${active ? color + "40" : "var(--border)"}`,
                  opacity: active ? 1 : 0.5,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">Difficulty</p>
        <div className="flex flex-col gap-1">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => onSetDifficulty(difficultyFilter === diff ? null : diff)}
              className={`rounded-lg px-2 py-1 text-left text-xs transition-all ${
                difficultyFilter === diff
                  ? "bg-white/10 text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={onResetZoom}>
        Reset Zoom
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Lift filter state to page.tsx and wire in GraphView + GraphControls**

Update `src/app/page.tsx`:

Add imports:
```tsx
import { GraphView } from "@/components/graph/GraphView";
import { GraphControls } from "@/components/graph/GraphControls";
import { Relationship as RelType } from "@/lib/types";

const typedRelationships = relationships as RelType[];
```

Add state for graph filters:
```tsx
const [categoryFilters, setCategoryFilters] = useState<Set<Category>>(new Set());
const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
const graphRef = useRef<any>(null);
```

Add handler:
```tsx
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
```

Replace graph placeholder:
```tsx
<GraphView
  topics={typedTopics}
  relationships={typedRelationships}
  highlightedNodeId={highlightedNodeId}
  onNodeClick={handleTopicSelect}
  onBackClick={handleBackToUmbrella}
/>
<GraphControls
  categoryFilters={categoryFilters}
  onToggleCategory={handleToggleCategory}
  difficultyFilter={difficultyFilter}
  onSetDifficulty={setDifficultyFilter}
  onBackClick={handleBackToUmbrella}
  onResetZoom={() => {}}
/>
```

Note: The category and difficulty filter state needs to be passed into GraphView as well. Add `categoryFilters` and `difficultyFilter` as props to GraphView and remove the internal state for those from GraphView, using the props instead.

- [ ] **Step 4: Verify graph view works**

```bash
npm run dev
```

Expected: Click "Explore Graph →" from umbrella view. Graph shows nodes colored by category. Hover highlights connections. Click node shows topic card (empty for now). Filter pills work. "Back to Umbrella" returns to umbrella view.

- [ ] **Step 5: Commit**

```bash
git add src/components/graph/ src/app/page.tsx
git commit -m "feat: add interactive graph view with force-directed layout and controls"
```

---

### Task 7: Topic Card Drawer

**Files:**
- Create: `src/components/topic/TopicCard.tsx`
- Create: `src/components/topic/TopicList.tsx`
- Modify: `src/app/page.tsx` (wire in topic card)

- [ ] **Step 1: Create TopicCard component**

Create `src/components/topic/TopicCard.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Topic, Relationship, Resource } from "@/lib/types";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TopicCardProps {
  topic: Topic;
  allTopics: Topic[];
  relationships: Relationship[];
  resources: Resource[];
  onClose: () => void;
  onTopicSelect: (topicId: string) => void;
  onViewInGraph: (topicId: string) => void;
  onExploreConnections: (topicId: string) => void;
}

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to prevent the opening click from immediately closing
    const timer = setTimeout(() => document.addEventListener("mousedown", handleClick), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Find prerequisites and related topics
  const prerequisites = relationships
    .filter((r) => r.target === topic.id && r.type === "prerequisite")
    .map((r) => allTopics.find((t) => t.id === r.source))
    .filter(Boolean) as Topic[];

  const relatedTopics = relationships
    .filter(
      (r) =>
        (r.source === topic.id || r.target === topic.id) &&
        r.type === "related"
    )
    .map((r) => {
      const otherId = r.source === topic.id ? r.target : r.source;
      return allTopics.find((t) => t.id === otherId);
    })
    .filter(Boolean) as Topic[];

  const topicResources = resources.filter((r) => r.topicId === topic.id);
  const articles = topicResources.filter((r) => r.type === "article");
  const videos = topicResources.filter((r) => r.type === "video");
  const courses = topicResources.filter((r) => r.type === "course");

  return (
    <motion.div
      ref={cardRef}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-30 h-full w-[420px] max-w-full overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">{topic.name}</h2>
            <div className="mt-2 flex gap-2">
              <CategoryBadge category={topic.category} />
              <DifficultyBadge difficulty={topic.difficulty} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-[var(--text-primary)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Description */}
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{topic.description}</p>

        {/* Tags */}
        {topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Prerequisites</h3>
            <div className="flex flex-wrap gap-2">
              {prerequisites.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTopicSelect(t.id)}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-primary)] transition-colors hover:bg-white/5"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTopicSelect(t.id)}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-primary)] transition-colors hover:bg-white/5"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {topicResources.length > 0 && (
          <div className="space-y-4">
            {videos.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Videos</h3>
                {videos.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
                  >
                    <span className="text-xs opacity-50">▶</span>
                    <span className="flex-1">{r.title}</span>
                    <span className="text-xs opacity-50">{r.source}</span>
                  </a>
                ))}
              </div>
            )}
            {articles.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Articles</h3>
                {articles.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
                  >
                    <span className="text-xs opacity-50">📄</span>
                    <span className="flex-1">{r.title}</span>
                    <span className="text-xs opacity-50">{r.source}</span>
                  </a>
                ))}
              </div>
            )}
            {courses.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Courses</h3>
                {courses.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
                  >
                    <span className="text-xs opacity-50">🎓</span>
                    <span className="flex-1">{r.title}</span>
                    <span className="text-xs opacity-50">{r.source}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => onViewInGraph(topic.id)}>
            View in Graph
          </Button>
          <Button size="sm" onClick={() => onExploreConnections(topic.id)}>
            Explore Connections
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create TopicList component**

Create `src/components/topic/TopicList.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Topic, Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { DifficultyBadge } from "@/components/ui/Badge";

interface TopicListProps {
  category: Category;
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
  onClose: () => void;
}

export function TopicList({ category, topics, onTopicSelect, onClose }: TopicListProps) {
  const color = CATEGORY_COLORS[category];
  const categoryTopics = topics
    .filter((t) => t.category === category)
    .sort((a, b) => b.importance - a.importance);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-30 h-full w-[420px] max-w-full overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl"
    >
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color }}>
            {category}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-[var(--text-primary)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {categoryTopics.length} topics
        </p>
      </div>

      <div className="p-4">
        {categoryTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.id)}
            className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">{topic.name}</span>
              <DifficultyBadge difficulty={topic.difficulty} />
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">
              {topic.description}
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Wire TopicCard and TopicList into page.tsx**

Add imports:
```tsx
import { TopicCard } from "@/components/topic/TopicCard";
import { TopicList } from "@/components/topic/TopicList";
import { Resource as ResType } from "@/lib/types";

const typedResources = resources as ResType[];
```

Add state to track whether we're showing a category list or a single topic:
```tsx
const [showCategoryList, setShowCategoryList] = useState(false);
```

Update the `onCategoryClick` handler:
```tsx
onCategoryClick={(category) => {
  setSelectedCategory(category);
  setShowCategoryList(true);
  setSelectedTopicId(null);
}}
```

After the AnimatePresence block for views, add:
```tsx
<AnimatePresence>
  {showCategoryList && selectedCategory && !selectedTopicId && (
    <TopicList
      category={selectedCategory}
      topics={typedTopics}
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
      allTopics={typedTopics}
      relationships={typedRelationships}
      resources={typedResources}
      onClose={handleCloseTopicCard}
      onTopicSelect={handleTopicSelect}
      onViewInGraph={handleViewInGraph}
      onExploreConnections={handleExploreConnections}
    />
  )}
</AnimatePresence>
```

- [ ] **Step 4: Verify topic card workflow**

```bash
npm run dev
```

Expected: Click an umbrella panel → category topic list slides in. Click a topic → topic card replaces list with full details. Prerequisites and related topics are clickable. "View in Graph" and "Explore Connections" work.

- [ ] **Step 5: Commit**

```bash
git add src/components/topic/ src/app/page.tsx
git commit -m "feat: add topic card drawer and category topic list"
```

---

### Task 8: Search Overlay

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/components/search/SearchOverlay.tsx`
- Modify: `src/app/page.tsx` (wire in search)

- [ ] **Step 1: Set up fuse.js search**

Create `src/lib/search.ts`:

```ts
import Fuse from "fuse.js";
import { Topic } from "./types";

export function createSearch(topics: Topic[]) {
  return new Fuse(topics, {
    keys: [
      { name: "name", weight: 2 },
      { name: "category", weight: 1 },
      { name: "tags", weight: 0.5 },
      { name: "description", weight: 0.3 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}
```

- [ ] **Step 2: Create SearchOverlay component**

Create `src/components/search/SearchOverlay.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Topic } from "@/lib/types";
import { createSearch } from "@/lib/search";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badge";

interface SearchOverlayProps {
  topics: Topic[];
  onSelect: (topicId: string) => void;
  onClose: () => void;
}

export function SearchOverlay({ topics, onSelect, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fuse = useMemo(() => createSearch(topics), [topics]);

  const results = query
    ? fuse.search(query).slice(0, 10).map((r) => r.item)
    : [];

  // Auto-focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      onSelect(results[selectedIndex].id);
      onClose();
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <svg className="h-5 w-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search 75+ CS topics..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
          />
          <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--text-secondary)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {query && results.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto py-2">
            {results.map((topic, i) => (
              <button
                key={topic.id}
                onClick={() => {
                  onSelect(topic.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selectedIndex ? "bg-white/5" : "hover:bg-white/5"
                }`}
              >
                <span className="flex-1 text-sm text-[var(--text-primary)]">{topic.name}</span>
                <CategoryBadge category={topic.category} />
                <DifficultyBadge difficulty={topic.difficulty} />
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
            No topics found for &ldquo;{query}&rdquo;
          </div>
        )}

        {!query && (
          <div className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
            Type to search 75+ CS topics
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Wire search into page.tsx**

Add import:
```tsx
import { SearchOverlay } from "@/components/search/SearchOverlay";
```

Add Cmd+K keyboard shortcut:
```tsx
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
```

Add search overlay after the topic card AnimatePresence:
```tsx
<AnimatePresence>
  {searchOpen && (
    <SearchOverlay
      topics={typedTopics}
      onSelect={(id) => {
        handleTopicSelect(id);
        setSearchOpen(false);
      }}
      onClose={() => setSearchOpen(false)}
    />
  )}
</AnimatePresence>
```

- [ ] **Step 4: Verify search works**

```bash
npm run dev
```

Expected: Cmd+K opens search overlay. Typing filters topics with fuzzy matching. Arrow keys navigate results. Enter selects. Clicking a result opens topic card.

- [ ] **Step 5: Commit**

```bash
git add src/lib/search.ts src/components/search/ src/app/page.tsx
git commit -m "feat: add Cmd+K search overlay with fuzzy matching"
```

---

### Task 9: Polish and Final Integration

**Files:**
- Modify: `src/app/page.tsx` (final wiring, edge cases)
- Modify: `src/app/globals.css` (dot grid background)
- Modify: various components for final polish

- [ ] **Step 1: Add dot grid background pattern to globals.css**

Add to `src/app/globals.css`:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Final page.tsx cleanup**

Ensure `src/app/page.tsx` has all state, handlers, and components properly wired together. The final page should:

1. Manage view state (umbrella/graph)
2. Pass all handlers to child components
3. Handle all keyboard shortcuts (Cmd+K)
4. Render Umbrella or Graph view with AnimatePresence transitions
5. Render TopicCard/TopicList drawers as overlays
6. Render SearchOverlay

Review for:
- Unused imports removed
- All event handlers properly memoized with useCallback
- No TypeScript errors

- [ ] **Step 3: Verify the complete user flow**

```bash
npm run dev
```

Walk through the full flow:
1. Land on homepage → see umbrella with rain, title, search bar
2. Hover umbrella panels → glow effect, tooltip with topic count
3. Click a panel → category topic list slides in
4. Click a topic → topic card with description, prerequisites, resources
5. Click "View in Graph" → transitions to graph view, centers on node
6. Click "Explore Connections" → graph view with connections highlighted
7. Hover nodes in graph → connections highlight, label shows
8. Click node in graph → topic card opens
9. Use category/difficulty filters → graph updates
10. Click "Back to Umbrella" → returns to homepage
11. Cmd+K → search overlay opens, fuzzy search works
12. Select search result → topic card opens

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: Build succeeds with no errors. Warnings about dynamic imports are OK.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: polish and final integration of all views"
```

---
