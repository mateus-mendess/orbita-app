import { Ionicons } from "@expo/vector-icons";

export type HabitIconName = keyof typeof Ionicons.glyphMap;

export interface Habit {
  id: string;
  title: string;
  icon: HabitIconName;
  frequencyDaysPerWeek: number; // 1 a 7 vezes por semana
  daysOfWeek?: number[]; // [0, 1, 2, 3, 4, 5, 6] onde 0 = Domingo, 6 = Sábado
  completedDates: string[]; // datas no formato YYYY-MM-DD
  createdAt?: string;
}

export interface HabitsContextData {
  habits: Habit[];
  addHabit: (data: {
    title: string;
    icon: HabitIconName;
    frequencyDaysPerWeek: number;
    daysOfWeek?: number[];
  }) => void;
  updateHabit: (id: string, data: Partial<Omit<Habit, "id">>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (id: string) => void;
  isHabitDoneToday: (habit: Habit) => boolean;
  getWeeklyProgress: (habit: Habit) => {
    completedThisWeek: number;
    target: number;
    percentage: number;
  };
}
