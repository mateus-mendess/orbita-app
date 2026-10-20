import React, { createContext, useCallback, useContext, useState } from "react";
import { Habit, HabitsContextData } from "../types/habits";
import { toDateKey } from "../types/tasks";

const HabitsContext = createContext<HabitsContextData>({} as HabitsContextData);

const getPastDateKey = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return toDateKey(d);
};

const INITIAL_HABITS: Habit[] = [
  {
    id: "1",
    title: "Beber 2L de água",
    icon: "water-outline",
    frequencyDaysPerWeek: 7,
    completedDates: [getPastDateKey(1), getPastDateKey(2)],
  },
  {
    id: "2",
    title: "Yoga & Alongamento",
    icon: "fitness-outline",
    frequencyDaysPerWeek: 5,
    completedDates: [getPastDateKey(1)],
  },
  {
    id: "3",
    title: "Meditação matinal",
    icon: "leaf-outline",
    frequencyDaysPerWeek: 7,
    completedDates: [getPastDateKey(2)],
  },
  {
    id: "4",
    title: "Trabalho em projetos",
    icon: "desktop-outline",
    frequencyDaysPerWeek: 5,
    completedDates: [],
  },
  {
    id: "5",
    title: "Caminhada ao ar livre",
    icon: "barbell-outline",
    frequencyDaysPerWeek: 4,
    completedDates: [getPastDateKey(1)],
  },
];

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  const addHabit = useCallback(
    (data: {
      title: string;
      icon: Habit["icon"];
      frequencyDaysPerWeek: number;
      daysOfWeek?: number[];
    }) => {
      setHabits((prev) => [
        {
          ...data,
          id: String(Date.now()),
          completedDates: [],
        },
        ...prev,
      ]);
    },
    []
  );

  const updateHabit = useCallback(
    (id: string, data: Partial<Omit<Habit, "id">>) => {
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...data } : h))
      );
    },
    []
  );

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const isHabitDoneToday = useCallback((habit: Habit) => {
    return habit.completedDates.includes(toDateKey(new Date()));
  }, []);

  const toggleHabitToday = useCallback((id: string) => {
    const today = toDateKey(new Date());
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: done
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      })
    );
  }, []);

  const getWeeklyProgress = useCallback((habit: Habit) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);

    const completedThisWeek = habit.completedDates.filter((d) => {
      const [year, month, day] = d.split("-").map(Number);
      const dt = new Date(year, month - 1, day);
      return dt >= sunday && dt <= now;
    }).length;

    const target = habit.frequencyDaysPerWeek || 7;
    const percentage = Math.min(100, Math.round((completedThisWeek / target) * 100));

    return { completedThisWeek, target, percentage };
  }, []);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitToday,
        isHabitDoneToday,
        getWeeklyProgress,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);
