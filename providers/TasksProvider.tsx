import React, { createContext, useCallback, useContext, useState } from "react";
import { Task, toDateKey } from "../types/tasks";

interface TasksContextData {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
}

const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toDateKey(d);
};

const INITIAL_TASKS: Task[] = [
  // Hoje: 5 tarefas (demonstra 3 traços + "+2")
  { id: "1", title: "Planejar o fim de semana", date: getRelativeDate(0), startTime: "06:30", endTime: "07:45", urgency: "muito_urgente", category: "pessoal", completed: false },
  { id: "2", title: "Pagar o boleto da luz", date: getRelativeDate(0), startTime: "07:30", endTime: "09:15", urgency: "urgente", category: "trabalho", completed: false },
  { id: "3", title: "Reunião de alinhamento", date: getRelativeDate(0), startTime: "10:00", endTime: "11:00", urgency: "pouco_urgente", category: "trabalho", completed: false },
  { id: "4", title: "Comprar mantimentos", date: getRelativeDate(0), startTime: "14:30", endTime: "15:30", urgency: "nao_urgente", category: "pessoal", completed: false },
  { id: "5", title: "Treino na academia", date: getRelativeDate(0), startTime: "19:00", endTime: "20:30", urgency: "muito_urgente", category: "pessoal", completed: false },
  // Amanhã: 3 tarefas (demonstra 3 traços)
  { id: "6", title: "Apresentação para cliente", date: getRelativeDate(1), startTime: "09:00", endTime: "10:30", urgency: "muito_urgente", category: "trabalho", completed: false },
  { id: "7", title: "Almoço em equipe", date: getRelativeDate(1), startTime: "12:30", endTime: "13:30", urgency: "pouco_urgente", category: "trabalho", completed: false },
  { id: "8", title: "Revisão do código", date: getRelativeDate(1), startTime: "18:00", endTime: "19:00", urgency: "urgente", category: "trabalho", completed: false },
  // Ontem: 2 tarefas (demonstra 2 traços)
  { id: "9", title: "Leitura de artigos", date: getRelativeDate(-1), startTime: "07:00", endTime: "08:00", urgency: "pouco_urgente", category: "estudo", completed: true },
  { id: "10", title: "Organizar mesa de trabalho", date: getRelativeDate(-1), startTime: "15:00", endTime: "16:00", urgency: "nao_urgente", category: "pessoal", completed: true },
  // 2 dias atrás: 1 tarefa (demonstra 1 traço)
  { id: "11", title: "Planejamento semanal", date: getRelativeDate(-2), startTime: "08:30", endTime: "09:30", urgency: "urgente", category: "trabalho", completed: true },
];

const TasksContext = createContext<TasksContextData>({} as TasksContextData);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = useCallback((data: Omit<Task, "id" | "completed">) => {
    setTasks((prev) => [{ ...data, id: String(Date.now()), completed: false }, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);

