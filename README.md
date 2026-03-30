# CS Umbrella

**Explore the entire field of computer science — visually connected.**

CS Umbrella is an interactive web app that maps computer science into a connected, explorable knowledge graph. Start with the umbrella visualization showing 8 top-level categories, then drill into an Obsidian-style graph to explore 75+ topics and their relationships.

## Features

- **Umbrella View** — Interactive SVG canopy with 8 CS categories. Click a panel to expand its topics inline.
- **Graph View** — Force-directed knowledge graph with 75 nodes and 130+ edges. Hover to highlight connections, click nodes to read about topics.
- **Topic Cards** — Detailed info for each topic including description, prerequisites, related topics, and learning resources.
- **Search** — Fuzzy search bar (Cmd+K) with instant results across all topics.
- **Responsive** — Works on desktop and tablet.

## Tech Stack

- [Next.js 15+](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [react-force-graph-2d](https://github.com/vasturiano/react-force-graph)
- [fuse.js](https://www.fusejs.io/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and Run

```bash
git clone https://github.com/YOUR_USERNAME/cs-umbrella.git
cd cs-umbrella
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    layout.tsx          — Root layout, dark theme, fonts
    page.tsx            — Main page, view state management
    globals.css         — Tailwind + CSS custom properties
  components/
    Navbar.tsx           — Top nav with view toggle
    SearchBar.tsx        — Bottom search bar with fuzzy matching
    umbrella/
      Umbrella.tsx       — Main umbrella visualization
      UmbrellaPanel.tsx  — Individual canopy panel
      RainEffect.tsx     — Canvas rain particle background
    graph/
      GraphView.tsx      — Force-directed graph (react-force-graph-2d)
      GraphControls.tsx  — Category/difficulty filters
    topic/
      TopicCard.tsx      — Slide-in topic detail drawer
    ui/
      Badge.tsx          — Category and difficulty badges
      Button.tsx         — Shared button component
      textarea.tsx       — Textarea (shadcn)
  data/
    topics.json          — 75 CS topics across 8 categories
    relationships.json   — 130 topic relationships
    resources.json       — 150+ learning resources
  lib/
    types.ts             — TypeScript interfaces
    constants.ts         — Colors, categories
    search.ts            — fuse.js search setup
    utils.ts             — cn() utility
```

## Contributing

We welcome contributions! Here's how to get started:

### Ways to Contribute

- **Add topics** — Expand the dataset beyond the initial 75 topics. Add entries to `src/data/topics.json`, relationships to `relationships.json`, and resources to `resources.json`.
- **Improve descriptions** — Make topic descriptions clearer or more beginner-friendly.
- **Add resources** — Link to high-quality articles, videos, and courses in `resources.json`.
- **Fix bugs** — Check the Issues tab.
- **Improve UI/UX** — Better animations, responsive design, accessibility.
- **New features** — Learning paths, progress tracking, 3D graph mode.

### Development Workflow

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run the build to check for errors: `npm run build`
5. Commit with a descriptive message: `git commit -m "feat: add new topics for cryptography"`
6. Push and open a PR

### Adding a New Topic

Add an entry to `src/data/topics.json`:

```json
{
  "id": "your_topic_id",
  "name": "Your Topic Name",
  "category": "Algorithms",
  "description": "A clear, 2-3 sentence beginner-friendly description.",
  "difficulty": "Beginner",
  "tags": ["relevant", "tags"],
  "importance": 3
}
```

Then add relationships in `relationships.json` and resources in `resources.json`.

### Data Validation

- All topic IDs must be unique and use `snake_case`
- All `source`/`target` in relationships must reference valid topic IDs
- All `topicId` in resources must reference valid topic IDs
- Categories must be one of: Algorithms, Data Structures, AI / ML, Systems, Web Dev, Networking, Security, Databases

### Commit Convention

We use conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `data:` — Dataset changes (new topics, resources, relationships)

## Roadmap

- [ ] 3D graph view (react-force-graph-3d)
- [ ] Learning paths / skill trees
- [ ] User accounts and progress tracking
- [ ] AI-powered topic explanations
- [ ] More topics (200+)
- [ ] Mobile-optimized layout
- [ ] Light mode

## License

MIT
