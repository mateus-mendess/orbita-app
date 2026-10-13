export type CategoryKey = "pessoal" | "trabalho" | "estudo";

export const CATEGORY_CONFIG: Record<
  CategoryKey,
  { label: string; color: string; icon: "person-outline" | "briefcase-outline" | "book-outline" }
> = {
  pessoal: { label: "Pessoal", color: "#94A3B8", icon: "person-outline" },
  trabalho: { label: "Trabalho", color: "#CBD5E1", icon: "briefcase-outline" },
  estudo: { label: "Estudo", color: "#A8A29E", icon: "book-outline" },
};
