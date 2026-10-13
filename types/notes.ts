import { CategoryKey } from "./categories";

export interface Note {
  id: string;
  title: string;
  category: CategoryKey;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
