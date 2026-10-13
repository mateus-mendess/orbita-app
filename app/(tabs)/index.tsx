import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { CalendarView } from "../../components/(tabs)/CalendarView";
import { EmptyState } from "../../components/(tabs)/EmptyState";
import { TaskPeriodSection } from "../../components/(tabs)/TaskPeriodSection";
import { TopHeader } from "../../components/(tabs)/TopHeader";
import { THEME_COLORS } from "../../constants/theme";
import { useTasks } from "../../hooks/useTasks";
import { PERIOD_CONFIG, PeriodId, getTaskPeriod } from "../../types/tasks";

const PERIOD_KEYS: PeriodId[] = ["morning", "afternoon", "night"];

export default function Home() {
  const { tasks, toggleTask } = useTasks();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const toggleView = () => {
    setViewMode((prev) => (prev === "list" ? "calendar" : "list"));
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
                  tasks={tasks.filter((t) => getTaskPeriod(t.startTime) === key)}
                  onToggleTask={toggleTask}
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

