import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  CATEGORY_CONFIG,
  Task,
  URGENCY_CONFIG,
  normalizeCategory,
  normalizeUrgency,
} from "../../types/tasks";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const urgency = URGENCY_CONFIG[normalizeUrgency(task.urgency)];
  const category = CATEGORY_CONFIG[normalizeCategory(task.category)];
  const time =
    task.startTime && task.endTime
      ? `${task.startTime}–${task.endTime}`
      : task.startTime || "";

  const handleEdit = () => {
    swipeableRef.current?.close();
    onEdit?.(task);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete?.(task);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.actionsContainer}>
        {/* Botão Editar */}
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        {/* Botão Deletar */}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" style={{ marginBottom: 4 }} />
          <Text style={styles.actionText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Pressable
            hitSlop={8}
            style={styles.checkbox}
            onPress={() => onToggle(task.id)}
          >
            <Ionicons
              name={task.completed ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={task.completed ? "#FFFFFF" : "#555"}
            />
          </Pressable>

          <Text
            style={[styles.title, task.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {time ? (
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={13} color="#888" style={{ marginRight: 4 }} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.tag}>
            <Ionicons name={urgency.icon} size={13} color={urgency.color} style={{ marginRight: 4 }} />
            <Text style={[styles.tagText, { color: urgency.color }]}>{urgency.label}</Text>
          </View>

          <View style={styles.tag}>
            <Ionicons name={category.icon} size={13} color={category.color} style={{ marginRight: 4 }} />
            <Text style={[styles.tagText, { color: category.color }]}>{category.label}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#161616",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#262626",
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  actionButton: {
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  editButton: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
    marginRight: 12,
  },
  titleDone: {
    textDecorationLine: "line-through",
    opacity: 0.45,
    color: "#AAA",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "#888",
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 32,
    gap: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
