import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Modal,
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

interface HabitItemProps {
  habit: Habit;
  isDone: boolean;
  isExpanded: boolean;
  progress: { completedThisWeek: number; target: number; percentage: number };
  onToggleExpand: () => void;
  onToggleDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isDone,
  isExpanded,
  progress,
  onToggleExpand,
  onToggleDone,
  onEdit,
  onDelete,
}) => {
  const frequencyText =
    habit.frequencyDaysPerWeek === 7
      ? "Todos os dias"
      : `${habit.frequencyDaysPerWeek}x na semana`;

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <Pressable
        style={styles.mainRow}
        onPress={onToggleExpand}
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
              progress.percentage === 100 && styles.percentageCompleted,
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
                  rotate: isExpanded && !isDone ? "180deg" : "0deg",
                },
              ],
            }}
          />
        </View>
      </Pressable>

      {/* Painel expandido: Botões de Ação */}
      {isExpanded && (
        <View style={styles.actionPanel}>
          <View style={styles.progressSummary}>
            <Text style={styles.progressSummaryText}>
              Nesta semana: {progress.completedThisWeek} de {progress.target} dias
            </Text>
          </View>

          <View style={styles.actionRow}>
            {/* Botão Principal de Marcar / Desmarcar */}
            <TouchableOpacity
              style={[
                styles.markButton,
                isDone ? styles.markButtonDone : styles.markButtonPending,
              ]}
              onPress={onToggleDone}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.markButtonText,
                  isDone ? styles.markButtonTextDone : styles.markButtonTextPending,
                ]}
                numberOfLines={1}
              >
                {isDone ? "Concluído hoje" : "Marcar como feito"}
              </Text>
            </TouchableOpacity>

            {/* Botão Editar */}
            <TouchableOpacity
              style={styles.cardIconButton}
              onPress={onEdit}
              activeOpacity={0.8}
              accessibilityLabel="Editar hábito"
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Botão Excluir */}
            <TouchableOpacity
              style={[styles.cardIconButton, styles.deleteCardIconButton]}
              onPress={onDelete}
              activeOpacity={0.8}
              accessibilityLabel="Excluir hábito"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default function HabitsScreen() {
  const {
    habits,
    toggleHabitToday,
    deleteHabit,
    isHabitDoneToday,
    getWeeklyProgress,
  } = useHabits();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleHabitToday(id);
  };

  const handleEdit = (habit: Habit) => {
    router.push({ pathname: "/new-habit" as any, params: { habitId: habit.id } });
  };

  const handleDeleteConfirm = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
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
                Toque no botão &quot;+&quot; acima para cadastrar seu primeiro hábito.
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                isDone={isHabitDoneToday(habit)}
                isExpanded={expandedId === habit.id}
                progress={getWeeklyProgress(habit)}
                onToggleExpand={() => toggleExpand(habit.id)}
                onToggleDone={() => handleToggle(habit.id)}
                onEdit={() => handleEdit(habit)}
                onDelete={() => setHabitToDelete(habit)}
              />
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      {/* Modal Bottom Sheet de Confirmação para Deletar Hábito */}
      <Modal
        visible={!!habitToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setHabitToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setHabitToDelete(null)} />

          <View style={styles.confirmSheet}>
            <View style={styles.dragHandle} />

            <View style={styles.confirmHeader}>
              <View style={styles.placeholder} />
              <Text style={styles.confirmTitle}>Deseja apagar este hábito?</Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setHabitToDelete(null)}
                hitSlop={10}
              >
                <Ionicons name="close" size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmActionContainer}>
              <TouchableOpacity
                style={styles.deleteRow}
                onPress={handleDeleteConfirm}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={22} color="#EF4444" style={styles.deleteIcon} />
                <Text style={styles.deleteActionText}>Apagar hábito</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </View>
        </View>
      </Modal>
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
    alignSelf: "center",
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
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  markButton: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
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
  cardIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteCardIconButton: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  confirmSheet: {
    backgroundColor: THEME_COLORS.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  confirmHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  placeholder: {
    width: 36,
  },
  confirmTitle: {
    color: THEME_COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  closeModalButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmActionContainer: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    overflow: "hidden",
  },
  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  deleteIcon: {
    marginRight: 12,
  },
  deleteActionText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
