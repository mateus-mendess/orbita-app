import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "../../components/(tabs)/EmptyState";
import { TaskPeriodSection } from "../../components/(tabs)/TaskPeriodSection";
import { TopHeader } from "../../components/(tabs)/TopHeader";
import { useTasks } from "../../hooks/useTasks";
import { PERIOD_CONFIG, PeriodId, getTaskPeriod } from "../../types/tasks";

const PERIOD_KEYS: PeriodId[] = ["morning", "afternoon", "night"];

export default function Home() {
  const { tasks, toggleTask } = useTasks();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TopHeader />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
});
