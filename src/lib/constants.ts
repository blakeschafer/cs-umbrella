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
  "Math": "#818cf8",
  "DevOps": "#2dd4bf",
  "Languages": "#e879f9",
  "Software Engineering": "#38bdf8",
};

export const CATEGORIES: Category[] = [
  "Algorithms",
  "Data Structures",
  "AI / ML",
  "Math",
  "Systems",
  "DevOps",
  "Web Dev",
  "Networking",
  "Security",
  "Databases",
  "Languages",
  "Software Engineering",
];

export const DIFFICULTY_COLORS: Record<string, string> = {
  "Beginner": "#4ade80",
  "Intermediate": "#facc15",
  "Advanced": "#f87171",
};
