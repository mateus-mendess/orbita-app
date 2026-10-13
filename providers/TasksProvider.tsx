import React, { createContext, useContext, useState } from "react";
import { Task } from "../types/tasks";

interface TasksContextData {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Planejar o fim de semana",
    date: "Hoje",
    startTime: "06:30",
    endTime: "07:45",
    urgency: "muito_urgente",
    category: "pessoal",
    completed: false,
  },
  {
    id: "2",
    title: "Pagar o boleto da luz",
    date: "Hoje",
    startTime: "07:30",
    endTime: "09:15",
    urgency: "urgente",
    category: "trabalho",
    completed: false,
  },
];

const TasksContext = createContext<TasksContextData>({} as TasksContextData);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = (data: Omit<Task, "id" | "completed">) => {
    setTasks((prev) => [{ ...data, id: String(Date.now()), completed: false }, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
