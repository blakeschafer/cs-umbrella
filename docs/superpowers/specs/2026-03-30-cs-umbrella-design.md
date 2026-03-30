# CS Umbrella — Design Spec

*Explore the entire field of computer science — visually connected*

## Overview

CS Umbrella is an interactive Next.js web app that maps computer science into a connected, explorable graph. Users start at a polished umbrella visualization showing 8 top-level categories, then drill into an Obsidian-style knowledge graph to explore ~75 topics and their relationships.

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion (view transitions, umbrella interactions), Canvas API (rain particles)
- **Graph:** react-force-graph-2d
- **Search:** fuse.js (fuzzy matching)
- **Data:** Static JSON files (MVP — no backend)
- **Deployment:** Vercel

## Architecture

Single-page app with three layered views managed by React state (not routes):

1. **Umbrella View** (default/home)
2. **Graph View** (exploration mode)
3. **Topic Card** (slide-in drawer, overlays either view)

Plus a global search overlay (Cmd+K).

### File Structure

```
src/
  app/
    layout.tsx          — root layout, dark theme, fonts
    page.tsx            — main page, view state management
    globals.css         — tailwind imports, custom properties
  components/
    umbrella/
      Umbrella.tsx      — main umbrella SVG component
      UmbrellaPanel.tsx — individual panel (category)
      RainEffect.tsx    — canvas particle rain background
    graph/
      GraphView.tsx     — react-force-graph-2d wrapper
      GraphControls.tsx — zoom/filter controls
    topic/
      TopicCard.tsx     — slide-in drawer with topic details
      TopicList.tsx     — category topic list (from umbrella click)
    search/
      SearchOverlay.tsx — Cmd+K fuzzy search modal
    ui/
      Button.tsx        — shared button component
      Badge.tsx         — difficulty/category badges
  data/
    topics.json         — all topic nodes
    relationships.json  — edges between topics
    resources.json      — learning resources per topic
  lib/
    types.ts            — TypeScript interfaces
    constants.ts        — colors, categories, config
    search.ts           — fuse.js setup
```

## Section 1: Umbrella Homepage

### SVG Umbrella

Custom SVG component with 8 curved panels radiating from a central pole. Each panel = one CS category.

**Categories (left to right across canopy):**
1. Algorithms (#22d3ee cyan)
2. Data Structures (#a78bfa purple)
3. AI / ML (#f472b6 pink)
4. Systems (#fb923c orange)
5. Web Dev (#4ade80 green)
6. Networking (#60a5fa blue)
7. Security (#f87171 red)
8. Databases (#facc15 yellow)

**Visual treatment:**
- Background: near-black (#0a0a0f) with subtle dot grid pattern
- Each panel has a unique neon color with soft inner glow
- Idle: panels have subtle ambient pulse animation
- Hover: panel brightens, slight scale-up (1.05), glow intensifies, floating tooltip shows category name + topic count
- Click: panel pulses, topic list drawer slides in from right showing that category's topics
- Rain particle effect on canvas layer behind SVG for ambient life

**Below umbrella:**
- App title "CS Umbrella" with umbrella icon
- Tagline: "Explore the entire field of computer science — visually connected"
- Search bar with Cmd+K hint
- "Click a topic to begin" prompt

### Transition to Graph View

When user clicks "Explore Connections" (from topic card or a dedicated button):
- Umbrella panels fade/dissolve outward
- Each panel morphs into its category's cluster of nodes in the graph
- Framer Motion AnimatePresence handles the crossfade
- Graph view fades in with nodes already positioned by category cluster

## Section 2: Graph View

### react-force-graph-2d Configuration

- **Nodes:** circles, color-coded by category (same palette as umbrella panels)
- **Node size:** scaled by importance (number of connections). Min 4px, max 16px radius.
- **Edge style:**
  - Prerequisite: solid line, directional arrow
  - Related: dashed line, no arrow
- **Edge color:** subtle gray (#333), brightens on hover
- **Layout:** force-directed with category clustering (custom force to group same-category nodes)

### Interactions

- **Pan/zoom:** built-in, smooth. Scroll to zoom, drag to pan.
- **Hover node:** highlights node + all connected edges, dims others. Shows tooltip with topic name + difficulty.
- **Click node:** opens topic card drawer. Centers/zooms to node.
- **Click edge:** shows relationship type tooltip.
- **Right-click node:** "View prerequisites" highlights the prerequisite chain.

### Controls (top-right overlay)

- Category filter toggles (colored pills matching palette)
- Zoom in/out/reset buttons
- "Back to Umbrella" button
- Difficulty filter (Beginner / Intermediate / Advanced)

## Section 3: Topic Cards

Slide-in drawer from right side, overlays current view (umbrella or graph). Width: 420px on desktop, full-screen on mobile.

### Card Content

- **Header:** Topic name, category badge (colored), difficulty badge
- **Description:** 2-3 sentence beginner-friendly explanation
- **Prerequisites:** clickable chips linking to other topic cards
- **Related Topics:** clickable chips
- **Tags:** small labels for cross-cutting concepts

### Resources Section

- Grouped by type: Articles, Videos, Courses
- Each resource: title, source, external link icon
- Max 3 per type for MVP

### Actions

- "View in Graph" — switches to graph view, centers on this node
- "Explore Connections" — switches to graph view, highlights this node's connections
- Close button (X) + click-outside-to-close

## Section 4: Search

### Cmd+K Overlay

- Triggered by Cmd+K (Mac) / Ctrl+K (Windows) or clicking search bar
- Centered modal with search input, auto-focused
- Instant results as user types (fuse.js fuzzy matching)
- Results show: topic name, category badge, difficulty
- Max 10 results displayed

### Behavior

- Click result: opens topic card, closes search
- If in graph view: also centers/highlights the node
- Escape closes search
- Empty state: shows "Type to search 75+ CS topics"

## Section 5: Data Model

### Topic (topics.json)

```typescript
interface Topic {
  id: string;              // e.g. "binary_trees"
  name: string;            // e.g. "Binary Trees"
  category: Category;      // one of 8 categories
  description: string;     // 2-3 sentences, beginner-friendly
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];          // e.g. ["trees", "recursion"]
  importance: number;      // 1-5, affects node size in graph
}
```

### Relationship (relationships.json)

```typescript
interface Relationship {
  source: string;          // topic id
  target: string;          // topic id
  type: "prerequisite" | "related";
}
```

### Resource (resources.json)

```typescript
interface Resource {
  topicId: string;
  title: string;
  url: string;
  type: "article" | "video" | "course";
  source: string;          // e.g. "YouTube", "MDN", "Coursera"
}
```

### Categories

```typescript
type Category =
  | "Algorithms"
  | "Data Structures"
  | "AI / ML"
  | "Systems"
  | "Web Dev"
  | "Networking"
  | "Security"
  | "Databases";
```

## Section 6: Design System

### Colors

- Background: #0a0a0f
- Surface: #141420
- Border: #1e1e2e
- Text primary: #e2e8f0
- Text secondary: #94a3b8
- Category colors: see Section 1

### Typography

- Font: Inter (or Geist Sans from Next.js default)
- Headings: semibold
- Body: regular, 14-16px

### Component Patterns

- Cards: surface bg, 1px border, rounded-xl, subtle shadow
- Badges: pill-shaped, category color bg at 20% opacity, category color text
- Buttons: rounded-lg, hover brightness increase
- Transitions: 200-300ms ease, Framer Motion for view changes

## Section 7: Responsive Behavior

- **Desktop (1024px+):** full umbrella, side-by-side graph + drawer
- **Tablet (768-1023px):** smaller umbrella, drawer overlays graph
- **Mobile (<768px):** simplified umbrella (vertical stack of category cards instead of SVG), full-screen drawer, graph still functional with touch zoom/pan

## Section 8: MVP Scope

### In Scope
- Umbrella homepage with polished animations and rain effect
- Graph view with react-force-graph-2d
- Topic cards with descriptions, prerequisites, related topics
- Cmd+K search with fuzzy matching
- ~75 AI-generated topics across 8 categories
- Category and difficulty filters in graph view
- Dark mode only
- Responsive (desktop-first)

### Out of Scope (Phase 2+)
- 3D graph view
- User accounts / auth
- Progress tracking
- AI explanations
- Learning paths / skill trees
- Backend API
- Light mode
- Personalization
