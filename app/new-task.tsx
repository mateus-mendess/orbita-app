import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { AuthInput } from "../components/(auth)/AuthInput";
import { FieldRow } from "../components/shared/FieldRow";
import { ModalHeader } from "../components/shared/ModalHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { THEME_COLORS } from "../constants/theme";
import { useTasks } from "../hooks/useTasks";
import {
  CATEGORY_CONFIG,
  CategoryKey,
  URGENCY_CONFIG,
  UrgencyLevel,
  toDateKey,
} from "../types/tasks";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const pad = (n: number) => String(n).padStart(2, "0");
const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

const URGENCY_OPTIONS = (Object.keys(URGENCY_CONFIG) as UrgencyLevel[]).map(
  (k) => ({ key: k, ...URGENCY_CONFIG[k] })
);

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map(
  (k) => ({ key: k, ...CATEGORY_CONFIG[k] })
);

export default function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d;
  });
  const [urgency, setUrgency] = useState<UrgencyLevel>("nao_urgente");
  const [category, setCategory] = useState<CategoryKey>("pessoal");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addTask } = useTasks();

  const toggle = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Por favor, insira o título da tarefa.");
      return;
    }
    const startMins = startTime.getHours() * 60 + startTime.getMinutes();
    const endMins = endTime.getHours() * 60 + endTime.getMinutes();
    if (endMins <= startMins) {
      const msg = "O horário de término deve ser posterior ao horário de início.";
      setError(msg);
      Alert.alert("Horário inválido", msg);
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      date: toDateKey(date),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      urgency,
      category,
    });
    router.back();
  };

  const renderChips = <T extends string>(
    options: { key: T; label: string; color: string; icon: keyof typeof Ionicons.glyphMap }[],
    selected: T,
    onSelect: (val: T) => void
  ) => (
    <View style={styles.grid}>
      {options.map((opt) => {
        const active = selected === opt.key;
        return (
          <Pressable
            key={opt.key}
            style={[styles.chip, active && { borderColor: opt.color, backgroundColor: "rgba(255,255,255,0.06)" }]}
            onPress={() => {
              onSelect(opt.key);
              setOpenSection(null);
            }}
          >
            <Ionicons name={opt.icon} size={15} color={opt.color} style={{ marginRight: 6 }} />
            <Text style={[styles.chipText, active && { color: opt.color, fontWeight: "700" }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.sheet}>
        <ModalHeader title="Nova Tarefa" />

        <ScrollView contentContainerStyle={styles.scroll}>
          <AuthInput
            label="Título"
            iconName="document-text-outline"
            placeholder="Ex: Planejar o fim de semana"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (error) setError(null);
            }}
          />

          <AuthInput
            label="Descrição"
            iconName="text-outline"
            placeholder="Adicione detalhes..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={{ height: 8 }} />

          <FieldRow
            iconName="calendar-outline"
            label="Data"
            value={date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
            isExpanded={openSection === "date"}
            onPress={() => toggle("date")}
          >
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                themeVariant="dark"
                textColor="#FFF"
                onChange={(_, d) => {
                  if (d) setDate(d);
                  if (Platform.OS === "android") setOpenSection(null);
                }}
              />
            </View>
          </FieldRow>

          <FieldRow
            iconName="time-outline"
            label="Início"
            value={formatTime(startTime)}
            isExpanded={openSection === "start"}
            onPress={() => toggle("start")}
          >
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                themeVariant="dark"
                textColor="#FFF"
                onChange={(_, d) => {
                  if (d) setStartTime(d);
                  if (Platform.OS === "android") setOpenSection(null);
                }}
              />
            </View>
          </FieldRow>

          <FieldRow
            iconName="time-outline"
            label="Término"
            value={formatTime(endTime)}
            isExpanded={openSection === "end"}
            onPress={() => toggle("end")}
          >
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                themeVariant="dark"
                textColor="#FFF"
                onChange={(_, d) => {
                  if (d) setEndTime(d);
                  if (Platform.OS === "android") setOpenSection(null);
                }}
              />
            </View>
          </FieldRow>

          <FieldRow
            iconName="flag-outline"
            label="Nível de urgência"
            value={URGENCY_CONFIG[urgency].label}
            isExpanded={openSection === "urgency"}
            onPress={() => toggle("urgency")}
          >
            {renderChips(URGENCY_OPTIONS, urgency, setUrgency)}
          </FieldRow>

          <FieldRow
            iconName="pricetag-outline"
            label="Categoria"
            value={CATEGORY_CONFIG[category].label}
            isExpanded={openSection === "category"}
            onPress={() => toggle("category")}
          >
            {renderChips(CATEGORY_OPTIONS, category, setCategory)}
          </FieldRow>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF4D4D" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={{ marginTop: 20, marginBottom: 16 }}>
            <PrimaryButton title="Salvar tarefa" onPress={handleSave} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: THEME_COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    maxHeight: "90%",
    paddingBottom: 24,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  pickerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipText: {
    color: "#E0E0E0",
    fontSize: 14,
    fontWeight: "500",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 77, 77, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.3)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
});
