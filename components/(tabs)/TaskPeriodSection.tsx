import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SectionHeader } from "../shared/SectionHeader";
import { Task } from "../../types/tasks";
import { TaskCard } from "./TaskCard";

interface TaskPeriodSectionProps {
  label: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export const TaskPeriodSection: React.FC<TaskPeriodSectionProps> = ({
  label,
  tasks,
  onToggleTask,
  icon,
  iconColor,
}) => {
  if (tasks.length === 0) return null;

  const sortedTasks = [...tasks].sort((a, b) =>
    (a.startTime || "").localeCompare(b.startTime || "")
  );

  return (
    <View style={styles.container}>
      <SectionHeader
        title={label}
        count={tasks.length}
        icon={icon}
        iconColor={iconColor}
      />
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
});
