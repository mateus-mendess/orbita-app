import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Task,
  URGENCY_CONFIG,
  normalizeUrgency,
  toDateKey,
} from "../../types/tasks";
import { THEME_COLORS } from "../../constants/theme";
import { DaySheet } from "./DaySheet";

interface CalendarViewProps {
  tasks: Task[];
  onToggleTask?: (id: string) => void;
}

interface MonthItem {
  key: string;
  year: number;
  month: number;
  title: string;
  weeks: (number | null)[][];
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const MONTH_TITLE_HEIGHT = 24;
const MONTH_TITLE_MARGIN_TOP = 16;
const MONTH_TITLE_MARGIN_BOTTOM = 8;
const MONTH_HEADER_HEIGHT =
  MONTH_TITLE_MARGIN_TOP + MONTH_TITLE_HEIGHT + MONTH_TITLE_MARGIN_BOTTOM; // 48
const WEEK_ROW_HEIGHT = 60;
const MONTH_BOTTOM_MARGIN = 16;

// Gera os 25 meses com grade de semanas pré-computada uma única vez
const generateMonths = (): MonthItem[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const list: MonthItem[] = [];

  for (let offset = -12; offset <= 12; offset++) {
    const d = new Date(currentYear, currentMonth + offset, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const rawMonth = d.toLocaleDateString("pt-BR", { month: "long" });
    const capitalized = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    const title = y === currentYear ? capitalized : `${capitalized} ${y}`;

    const firstDayOfWeek = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const totalWeeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

    const weeks: (number | null)[][] = [];
    let day = 1;
    for (let w = 0; w < totalWeeks; w++) {
      const week: (number | null)[] = [];
      for (let col = 0; col < 7; col++) {
        if ((w === 0 && col < firstDayOfWeek) || day > daysInMonth) {
          week.push(null);
        } else {
          week.push(day++);
        }
      }
      weeks.push(week);
    }

    list.push({
      key: `${y}-${String(m + 1).padStart(2, "0")}`,
      year: y,
      month: m,
      title,
      weeks,
    });
  }

  return list;
};

const STATIC_MONTHS = generateMonths();

const getMonthHeight = (item: MonthItem) =>
  MONTH_HEADER_HEIGHT + item.weeks.length * WEEK_ROW_HEIGHT + MONTH_BOTTOM_MARGIN;

// Offsets acumulados exatos para cada um dos 25 meses: fonte única de verdade para getItemLayout
const MONTH_OFFSETS = (() => {
  const offsets: number[] = [];
  let acc = 0;
  for (const m of STATIC_MONTHS) {
    offsets.push(acc);
    acc += getMonthHeight(m);
  }
  return offsets;
})();

// Célula do dia isolada e memoizada: evita re-renderizar todo o calendário ao alterar uma tarefa
const DayCell = React.memo<{
  dayNum: number | null;
  dayKey?: string;
  isToday?: boolean;
  isWeekend?: boolean;
  tasks?: Task[];
  onSelect?: (key: string) => void;
}>(({ dayNum, dayKey, isToday, isWeekend, tasks, onSelect }) => {
  if (dayNum === null || !dayKey) {
    return <View style={styles.dayCell} />;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      style={styles.dayCell}
      onPress={() => onSelect?.(dayKey)}
    >
      <View style={[styles.dayNumberWrapper, isToday && styles.todayCircle]}>
        <Text
          style={[
            styles.dayText,
            isWeekend && styles.weekendText,
            isToday && styles.todayText,
          ]}
        >
          {dayNum}
        </Text>
      </View>

      {tasks && tasks.length > 0 ? (
        <View style={styles.markersContainer}>
          {tasks.slice(0, 3).map((t) => (
            <View
              key={t.id}
              style={[
                styles.markerBar,
                { backgroundColor: URGENCY_CONFIG[normalizeUrgency(t.urgency)].color },
              ]}
            />
          ))}
          {tasks.length > 3 ? (
            <Text style={styles.moreText}>+{tasks.length - 3}</Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.markerPlaceholder} />
      )}
    </TouchableOpacity>
  );
});

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<MonthItem>>(null);

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  // Agrupamento O(1) de tarefas por data
  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      const key = toDateKey(task.date);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    }
    for (const key in map) {
      map[key].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    }
    return map;
  }, [tasks]);

  const handleSelectDay = useCallback((key: string) => {
    setSelectedDate(key);
  }, []);

  const renderMonth = useCallback(
    ({ item }: { item: MonthItem }) => (
      <View style={styles.monthContainer}>
        <Text style={styles.monthTitle}>{item.title}</Text>
        <View style={styles.monthGrid}>
          {item.weeks.map((week, wIdx) => (
            <View key={wIdx} style={styles.weekRow}>
              {week.map((dayNum, colIdx) => {
                if (dayNum === null) {
                  return <DayCell key={`empty-${colIdx}`} dayNum={null} />;
                }
                const dayKey = `${item.year}-${String(item.month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                return (
                  <DayCell
                    key={dayKey}
                    dayNum={dayNum}
                    dayKey={dayKey}
                    isToday={dayKey === todayKey}
                    isWeekend={colIdx === 0 || colIdx === 6}
                    tasks={tasksByDay[dayKey]}
                    onSelect={handleSelectDay}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    ),
    [todayKey, tasksByDay, handleSelectDay]
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho fixo dos dias da semana */}
      <View style={styles.weekdayHeader}>
        {WEEKDAYS.map((day, idx) => (
          <View key={idx} style={styles.weekdayCol}>
            <Text
              style={[
                styles.weekdayText,
                (idx === 0 || idx === 6) && styles.weekendHeaderColor,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Grade contínua de meses */}
      <FlatList
        ref={flatListRef}
        data={STATIC_MONTHS}
        keyExtractor={(item) => item.key}
        renderItem={renderMonth}
        initialScrollIndex={12}
        getItemLayout={(_, index) => ({
          length: getMonthHeight(STATIC_MONTHS[index]),
          offset: MONTH_OFFSETS[index],
          index,
        })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal Bottom Sheet do Dia */}
      <DaySheet
        visible={Boolean(selectedDate)}
        dateKey={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  weekdayHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#222",
    backgroundColor: THEME_COLORS.background,
  },
  weekdayCol: {
    flex: 1,
    alignItems: "center",
  },
  weekdayText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  weekendHeaderColor: {
    color: "#555",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  monthContainer: {
    marginBottom: MONTH_BOTTOM_MARGIN,
  },
  monthTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    height: MONTH_TITLE_HEIGHT,
    lineHeight: MONTH_TITLE_HEIGHT,
    marginTop: MONTH_TITLE_MARGIN_TOP,
    marginBottom: MONTH_TITLE_MARGIN_BOTTOM,
    paddingHorizontal: 4,
  },
  monthGrid: {
    width: "100%",
  },
  weekRow: {
    flexDirection: "row",
    height: WEEK_ROW_HEIGHT,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  dayNumberWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCircle: {
    backgroundColor: "#FFF",
  },
  dayText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  weekendText: {
    color: "#666",
  },
  todayText: {
    color: "#000",
    fontWeight: "700",
  },
  markersContainer: {
    alignItems: "center",
    marginTop: 3,
    width: "100%",
  },
  markerBar: {
    width: 18,
    height: 2.5,
    borderRadius: 1.5,
    marginVertical: 1,
  },
  moreText: {
    color: "#888",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 0.5,
  },
  markerPlaceholder: {
    height: 12,
  },
});
