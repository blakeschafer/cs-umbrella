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
