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
