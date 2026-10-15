import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { THEME_COLORS } from "../constants/theme";
import { useHabits } from "../providers/HabitsProvider";
import { Habit } from "../types/habits";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HabitsScreen() {
  const { habits, toggleHabitToday, isHabitDoneToday, getWeeklyProgress } =
    useHabits();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleHabitToday(id);
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.sheet}>
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <View style={styles.dragHandle} />
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
              hitSlop={10}
            >
              <Ionicons name="close" size={22} color="#888" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Hábitos</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/new-habit" as any)}
              hitSlop={10}
            >
              <Ionicons name="add" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Hábitos */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {habits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="sparkles-outline"
                size={48}
                color={THEME_COLORS.textMuted}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyTitle}>Nenhum hábito cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Toque no botão "+" acima para cadastrar seu primeiro hábito.
              </Text>
            </View>
          ) : (
            habits.map((habit) => {
              const isDone = isHabitDoneToday(habit);
              const isExpanded = expandedId === habit.id;
              const progress = getWeeklyProgress(habit);
              const frequencyText =
                habit.frequencyDaysPerWeek === 7
                  ? "Todos os dias"
                  : `${habit.frequencyDaysPerWeek}x na semana`;

              return (
                <View
                  key={habit.id}
                  style={[styles.card, isDone && styles.cardDone]}
                >
                  <Pressable
                    style={styles.mainRow}
                    onPress={() => toggleExpand(habit.id)}
                    android_ripple={{ color: "rgba(255,255,255,0.05)" }}
                  >
                    {/* Ícone sem fundo colorido */}
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name={habit.icon}
                        size={24}
                        color={isDone ? "#10B981" : THEME_COLORS.text}
                      />
                    </View>

                    {/* Título e Frequência */}
                    <View style={styles.content}>
                      <Text
                        style={[styles.title, isDone && styles.titleDone]}
                        numberOfLines={1}
                      >
                        {habit.title}
                      </Text>
                      <Text style={styles.subtitle}>{frequencyText}</Text>
                    </View>

                    {/* Porcentagem e Indicador */}
                    <View style={styles.rightSection}>
                      <Text
                        style={[
                          styles.percentageText,
                          progress.percentage === 100 &&
                            styles.percentageCompleted,
                        ]}
                      >
                        {progress.percentage}%
                      </Text>
                      <Ionicons
                        name={isDone ? "checkmark-circle" : "chevron-down-outline"}
                        size={20}
                        color={isDone ? "#10B981" : THEME_COLORS.textMuted}
                        style={{
                          transform: [
                            {
                              rotate:
                                isExpanded && !isDone ? "180deg" : "0deg",
                            },
                          ],
                        }}
                      />
                    </View>
                  </Pressable>

                  {/* Painel expandido: Botão para marcar como feito */}
                  {isExpanded && (
                    <View style={styles.actionPanel}>
                      <View style={styles.progressSummary}>
                        <Text style={styles.progressSummaryText}>
                          Nesta semana: {progress.completedThisWeek} de{" "}
                          {progress.target} dias
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.markButton,
                          isDone
                            ? styles.markButtonDone
                            : styles.markButtonPending,
                        ]}
                        onPress={() => handleToggle(habit.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={
                            isDone
                              ? "checkmark-done-circle"
                              : "checkmark-circle-outline"
                          }
                          size={20}
                          color={isDone ? "#10B981" : "#000000"}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[
                            styles.markButtonText,
                            isDone
                              ? styles.markButtonTextDone
                              : styles.markButtonTextPending,
                          ]}
                        >
                          {isDone
                            ? "Concluído hoje (Toque para desmarcar)"
                            : "Marcar como feito hoje"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    backgroundColor: THEME_COLORS.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "88%",
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 14,
  },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: THEME_COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.text,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME_COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  card: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    overflow: "hidden",
  },
  cardDone: {
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME_COLORS.text,
    marginBottom: 4,
  },
  titleDone: {
    color: "#E2E8F0",
  },
  subtitle: {
    fontSize: 13,
    color: THEME_COLORS.textMuted,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  percentageText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F59E0B",
  },
  percentageCompleted: {
    color: "#10B981",
  },
  actionPanel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  progressSummary: {
    marginBottom: 10,
  },
  progressSummaryText: {
    fontSize: 12,
    color: THEME_COLORS.textMuted,
  },
  markButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  markButtonPending: {
    backgroundColor: THEME_COLORS.text,
  },
  markButtonDone: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  markButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  markButtonTextPending: {
    color: "#000000",
  },
  markButtonTextDone: {
    color: "#10B981",
  },
});
