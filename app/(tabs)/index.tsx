import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { CalendarView } from "../../components/(tabs)/CalendarView";
import { DeleteTaskModal } from "../../components/(tabs)/DeleteTaskModal";
import { EmptyState } from "../../components/(tabs)/EmptyState";
import { TaskPeriodSection } from "../../components/(tabs)/TaskPeriodSection";
import { TopHeader } from "../../components/(tabs)/TopHeader";
import { THEME_COLORS } from "../../constants/theme";
import { useTasks } from "../../hooks/useTasks";
import { PERIOD_CONFIG, PeriodId, Task, getTaskPeriod } from "../../types/tasks";

const PERIOD_KEYS: PeriodId[] = ["morning", "afternoon", "night"];

export default function Home() {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const toggleView = () => {
    setViewMode((prev) => (prev === "list" ? "calendar" : "list"));
  };

  const handleEditTask = (task: Task) => {
    router.push({ pathname: "/new-task" as any, params: { taskId: task.id } });
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      {viewMode === "list" ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopHeader viewMode={viewMode} onToggleView={toggleView} />

          <View style={styles.content}>
            {tasks.length > 0 ? (
              PERIOD_KEYS.map((key) => (
                <TaskPeriodSection
                  key={key}
                  label={PERIOD_CONFIG[key].label}
                  icon={PERIOD_CONFIG[key].icon}
                  iconColor={PERIOD_CONFIG[key].color}
                  tasks={tasks.filter((t) => getTaskPeriod(t.startTime) === key)}
                  onToggleTask={toggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.calendarContainer}>
          <View style={styles.headerWrapper}>
            <TopHeader viewMode={viewMode} onToggleView={toggleView} />
          </View>
          <CalendarView tasks={tasks} onToggleTask={toggleTask} />
        </View>
      )}

      {/* Modal de confirmação para deletar tarefa */}
      <DeleteTaskModal
        task={taskToDelete}
        visible={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 8,
  },
  calendarContainer: {
    flex: 1,
    paddingTop: 60,
  },
  headerWrapper: {
    paddingHorizontal: 20,
  },
});
