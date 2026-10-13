import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Task } from "../../types/tasks";
import { TaskCard } from "./TaskCard";

interface TaskPeriodSectionProps {
  label: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export const TaskPeriodSection: React.FC<TaskPeriodSectionProps> = ({
  label,
  tasks,
  onToggleTask,
}) => {
  if (tasks.length === 0) return null;

  const sortedTasks = [...tasks].sort((a, b) =>
    (a.startTime || "").localeCompare(b.startTime || "")
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.count}>· {tasks.length}</Text>
      </View>
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  title: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  count: {
    color: "#666",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
});
