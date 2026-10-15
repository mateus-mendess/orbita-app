import { Ionicons } from "@expo/vector-icons";

export type HabitIconName = keyof typeof Ionicons.glyphMap;

export interface Habit {
  id: string;
  title: string;
  icon: HabitIconName;
  frequencyDaysPerWeek: number; // 1 a 7 vezes por semana
  completedDates: string[]; // datas no formato YYYY-MM-DD
  createdAt?: string;
}

export interface HabitsContextData {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "completedDates" | "createdAt">) => void;
  toggleHabitToday: (id: string) => void;
  isHabitDoneToday: (habit: Habit) => boolean;
  getWeeklyProgress: (habit: Habit) => {
    completedThisWeek: number;
    target: number;
    percentage: number;
  };
}
