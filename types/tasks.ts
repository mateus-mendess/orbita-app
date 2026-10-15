export type UrgencyLevel =
  | "nao_urgente"
  | "pouco_urgente"
  | "urgente"
  | "muito_urgente";

export const URGENCY_CONFIG = {
  nao_urgente: { label: "Não urgente", color: "#3B82F6", icon: "flag" as const },
  pouco_urgente: { label: "Pouco urgente", color: "#10B981", icon: "flag" as const },
  urgente: { label: "Urgente", color: "#F59E0B", icon: "flag" as const },
  muito_urgente: { label: "Muito urgente", color: "#EF4444", icon: "flag" as const },
};

import { CategoryKey, CATEGORY_CONFIG } from "./categories";
export * from "./categories";

export type PeriodId = "morning" | "afternoon" | "night";

export const PERIOD_CONFIG: Record<
  PeriodId,
  {
    label: string;
    color: string;
    icon: "sunny-outline" | "cloud-outline" | "moon-outline";
  }
> = {
  morning: {
    label: "Manhã",
    color: "#F97316",
    icon: "sunny-outline",
  },
  afternoon: {
    label: "Tarde",
    color: "#38BDF8",
    icon: "cloud-outline",
  },
  night: {
    label: "Noite",
    color: "#A855F7",
    icon: "moon-outline",
  },
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  urgency: UrgencyLevel;
  category: CategoryKey;
  completed: boolean;
}

export function getTaskPeriod(startTime: string): PeriodId {
  const mins =
    parseInt(startTime.slice(0, 2) || "0", 10) * 60 +
    parseInt(startTime.slice(3, 5) || "0", 10);
  if (mins >= 300 && mins < 720) return "morning";
  if (mins >= 720 && mins < 1080) return "afternoon";
  return "night";
}

export function normalizeUrgency(u?: string): UrgencyLevel {
  if (u && u in URGENCY_CONFIG) return u as UrgencyLevel;
  if (u === "Urgente e importante" || u === "Alta") return "muito_urgente";
  return "nao_urgente";
}

export function normalizeCategory(c?: string): CategoryKey {
  if (c && c in CATEGORY_CONFIG) return c as CategoryKey;
  return "pessoal";
}

export function toDateKey(date: Date | string): string {
  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [d, m, y] = date.split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    if (date === "Hoje") {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    return date;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateKey: string): string {
  if (!dateKey) return "";
  const parts = dateKey.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0])) return dateKey;
  const [y, m, d] = parts;
  const dt = new Date(y, m - 1, d);
  const weekday = dt.toLocaleDateString("pt-BR", { weekday: "long" });
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized}, ${d}`;
}

const WEEKDAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

const MONTH_ABBREVIATIONS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export function formatCurrentHeaderDate(d: Date = new Date()): string {
  const day = d.getDate();
  const month = MONTH_ABBREVIATIONS[d.getMonth()];
  const year2 = String(d.getFullYear()).slice(-2);
  const weekday = WEEKDAY_NAMES[d.getDay()];
  return `${day} ${month}, ${year2} ${weekday}`;
}


