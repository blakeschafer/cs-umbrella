# CS Umbrella

**Explore the entire field of computer science — visually connected.**

An interactive web app that maps 190+ computer science topics into a connected, explorable knowledge graph. Start with the umbrella visualization showing 12 categories, then drill into an Obsidian-style force-directed graph to explore topics and their relationships.

**Live demo:** [cs-umbrella.vercel.app](https://cs-umbrella.vercel.app) (coming soon)

## Screenshots

TODO: Add screenshots of umbrella view, graph view, and topic cards.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 15+](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Graph | [react-force-graph-2d](https://github.com/vasturiano/react-force-graph) |
| Search | [fuse.js](https://www.fusejs.io/) |
| Data | Static JSON (no backend required) |

## Getting Started

```bash
git clone https://github.com/blakeschafer/cs-umbrella.git
cd cs-umbrella
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no backend, no database, no API keys needed.

## Project Structure

```
src/
  app/
    layout.tsx             Root layout, dark theme, Geist font
    page.tsx               Main page — view state, all handlers
    globals.css            Tailwind imports + CSS custom properties
  components/
    Navbar.tsx             Top nav with Umbrella/Graph toggle + GitHub link
    SearchBar.tsx          Inline search with typewriter animation
    umbrella/
      Umbrella.tsx         Main umbrella SVG + expanded topic grid
      UmbrellaPanel.tsx    Individual canopy petal (arc geometry + labels)
      RainEffect.tsx       Canvas particle rain background
    graph/
      GraphView.tsx        Force-directed graph (react-force-graph-2d)
      GraphControls.tsx    Category and difficulty filter panel
    topic/
      TopicCard.tsx        Slide-in drawer — details, roadmap, resources
    ui/
      Badge.tsx            Category + difficulty badge components
      Button.tsx           Shared button (primary/ghost variants)
      textarea.tsx         Textarea component
  data/
    topics.json            190 CS topics across 12 categories
    relationships.json     358 topic relationships (prerequisite + related)
    resources.json         429 learning resources (videos, articles, courses)
  lib/
    types.ts               TypeScript interfaces (Topic, Relationship, etc.)
    constants.ts           Category colors, category list, difficulty colors
    search.ts              fuse.js configuration
    utils.ts               cn() utility for class merging
```

## Contributing

We're actively looking for contributors. Here's how you can help:

### 1. Add or improve topics (easiest way to start)

The entire dataset lives in `src/data/`. No code changes needed — just JSON.

**Add a topic** to `src/data/topics.json`:

```json
{
  "id": "your_topic_id",
  "name": "Your Topic Name",
  "category": "AI / ML",
  "description": "A clear, 2-3 sentence beginner-friendly explanation.",
  "difficulty": "Intermediate",
  "tags": ["relevant", "tags"],
  "importance": 3,
  "roadmap": [
    "Step 1: What to learn first",
    "Step 2: Hands-on exercise",
    "Step 3: Build something with it",
    "Step 4: Deep dive into advanced concepts",
    "Step 5: Real-world project"
  ]
}
```

**Add relationships** to `src/data/relationships.json`:

```json
{ "source": "prerequisite_topic_id", "target": "your_topic_id", "type": "prerequisite" },
{ "source": "your_topic_id", "target": "related_topic_id", "type": "related" }
```

**Add resources** to `src/data/resources.json`:

```json
{
  "topicId": "your_topic_id",
  "title": "Resource Title",
  "url": "https://...",
  "type": "video",
  "source": "freeCodeCamp"
}
```

### 2. Fix bugs or improve UI

Check the [Issues](https://github.com/blakeschafer/cs-umbrella/issues) tab. Good first issues are labeled.

### 3. Add features from the roadmap

See the roadmap section below for ideas.

### Data validation rules

- Topic IDs: unique, `snake_case`
- All `source`/`target` in relationships must reference existing topic IDs
- All `topicId` in resources must reference existing topic IDs
- Valid categories: `Algorithms`, `Data Structures`, `AI / ML`, `Systems`, `Web Dev`, `Networking`, `Security`, `Databases`, `Math`, `DevOps`, `Languages`, `Software Engineering`
- Valid difficulties: `Beginner`, `Intermediate`, `Advanced`
- Every topic should have a `roadmap` with 5-8 actionable learning steps

**Validate your changes:**

```bash
node -e "
const t=require('./src/data/topics.json');
const r=require('./src/data/relationships.json');
const res=require('./src/data/resources.json');
const ids=new Set(t.map(x=>x.id));
const dupes=t.length - ids.size;
const badRels=r.filter(x=>!ids.has(x.source)||!ids.has(x.target));
const badRes=res.filter(x=>!ids.has(x.topicId));
const noRoadmap=t.filter(x=>!x.roadmap||x.roadmap.length===0);
console.log('Topics:', t.length, dupes ? '('+dupes+' DUPLICATES!)' : '');
console.log('Relationships:', r.length, badRels.length ? '('+badRels.length+' BROKEN!)' : '');
console.log('Resources:', res.length, badRes.length ? '('+badRes.length+' BROKEN!)' : '');
console.log('Missing roadmaps:', noRoadmap.length);
"
```

### Development workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/cs-umbrella.git
cd cs-umbrella
npm install

# 2. Create a branch
git checkout -b feat/your-feature

# 3. Make changes and verify
npm run dev          # check visually
npm run build        # must pass with no errors

# 4. Commit and PR
git commit -m "feat: add quantum computing topics"
git push origin feat/your-feature
# Open PR on GitHub
```

### Commit convention

- `feat:` New feature or topic additions
- `fix:` Bug fix
- `data:` Dataset changes (topics, relationships, resources)
- `docs:` Documentation updates
- `ui:` Visual/styling changes

## Roadmap

- [ ] 3D graph view (react-force-graph-3d)
- [ ] Learning paths / skill trees (guided sequences through topics)
- [ ] User accounts and progress tracking
- [ ] AI-powered topic explanations
- [ ] Quiz/assessment per topic
- [ ] Mobile-optimized layout
- [ ] Light mode
- [ ] Embeddable widget for other sites
- [ ] Community-submitted topics via PR workflow

## License

MIT
