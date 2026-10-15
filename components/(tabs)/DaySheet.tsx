import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTasks } from "../../hooks/useTasks";
import {
  PERIOD_CONFIG,
  PeriodId,
  formatDisplayDate,
  getTaskPeriod,
  toDateKey,
} from "../../types/tasks";
import { TaskPeriodSection } from "./TaskPeriodSection";

interface DaySheetProps {
  visible: boolean;
  dateKey: string | null;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HALF_OFFSET = SCREEN_HEIGHT * 0.4;
const PERIOD_KEYS: PeriodId[] = ["morning", "afternoon", "night"];

export const DaySheet: React.FC<DaySheetProps> = ({
  visible,
  dateKey,
  onClose,
}) => {
  const { tasks, toggleTask } = useTasks();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const currentSnap = useRef(HALF_OFFSET);

  // Deriva as tarefas do dia diretamente da fonte única de verdade (useTasks)
  const dayTasks = useMemo(() => {
    if (!dateKey) return [];
    return tasks
      .filter((t) => toDateKey(t.date) === dateKey)
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  }, [tasks, dateKey]);

  useEffect(() => {
    if (visible) {
      currentSnap.current = HALF_OFFSET;
      translateY.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: HALF_OFFSET,
          useNativeDriver: true,
          bounciness: 4,
          speed: 14,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const next = currentSnap.current + g.dy;
        if (next >= 0) translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.5) {
          handleClose();
        } else if (g.dy < -50 || g.vy < -0.5) {
          currentSnap.current = 0;
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue: currentSnap.current,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  if (!visible && !dateKey) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Alça e cabeçalho do sheet */}
          <View {...panResponder.panHandlers} style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {dateKey ? formatDisplayDate(dateKey) : ""}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                hitSlop={8}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de tarefas por período */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {dayTasks.length > 0 ? (
              PERIOD_KEYS.map((key) => (
                <TaskPeriodSection
                  key={key}
                  label={PERIOD_CONFIG[key].label}
                  icon={PERIOD_CONFIG[key].icon}
                  iconColor={PERIOD_CONFIG[key].color}
                  tasks={dayTasks.filter((t) => getTaskPeriod(t.startTime) === key)}
                  onToggleTask={toggleTask}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={32}
                  color="#444"
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.emptyText}>Nenhuma tarefa para este dia</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: "#161616",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#262626",
    overflow: "hidden",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
    alignSelf: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});
