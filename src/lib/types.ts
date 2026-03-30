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
