import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME_COLORS } from "../../constants/theme";
import { Task } from "../../types/tasks";

interface DeleteTaskModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  task,
  visible,
  onClose,
  onConfirm,
}) => {
  if (!visible || !task) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          {/* Cabeçalho com título centralizado e botão X */}
          <View style={styles.header}>
            <View style={styles.placeholder} />
            <Text style={styles.title}>Deseja apagar esta tarefa?</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Container de Ação Destrutiva conforme design de referência */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.deleteRow}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={22} color="#EF4444" style={styles.actionIcon} />
              <Text style={styles.deleteText}>Apagar tarefa</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </View>
    </Modal>
  );
};

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
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  placeholder: {
    width: 36,
  },
  title: {
    color: THEME_COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContainer: {
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
  actionIcon: {
    marginRight: 12,
  },
  deleteText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
