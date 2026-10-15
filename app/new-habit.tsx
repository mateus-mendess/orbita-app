import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { THEME_COLORS } from "../constants/theme";
import { useHabits } from "../providers/HabitsProvider";
import { HabitIconName } from "../types/habits";

const AVAILABLE_ICONS: HabitIconName[] = [
  "flame-outline",
  "water-outline",
  "book-outline",
  "leaf-outline",
  "fitness-outline",
  "barbell-outline",
  "bed-outline",
  "medkit-outline",
  "heart-outline",
  "moon-outline",
  "sunny-outline",
  "alarm-outline",
  "school-outline",
  "nutrition-outline",
  "sparkles-outline",
  "cash-outline",
  "desktop-outline",
  "star-outline",
];

const DAYS_OF_WEEK = [
  { id: 0, label: "Dom" },
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
];

export default function NewHabitScreen() {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<HabitIconName>(AVAILABLE_ICONS[0]);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [error, setError] = useState<string | null>(null);

  const { addHabit } = useHabits();

  const toggleDay = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId].sort((a, b) => a - b)
    );
    if (error) setError(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      const msg = "Por favor, digite o título do hábito.";
      setError(msg);
      Alert.alert("Campo obrigatório", msg);
      return;
    }

    if (selectedDays.length === 0) {
      const msg = "Por favor, selecione pelo menos 1 dia da semana.";
      setError(msg);
      Alert.alert("Frequência obrigatória", msg);
      return;
    }

    addHabit({
      title: title.trim(),
      icon: selectedIcon,
      frequencyDaysPerWeek: selectedDays.length,
      daysOfWeek: selectedDays,
    });

    router.back();
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheet}
      >
        {/* Drag handle e Cabeçalho */}
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

            <Text style={styles.headerTitle}>Novo Hábito</Text>

            <TouchableOpacity
              style={styles.saveCheckButton}
              onPress={handleSave}
              hitSlop={10}
            >
              <Ionicons name="checkmark" size={22} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Campo Título */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título</Text>
            <View
              style={[
                styles.textInputWrapper,
                error ? styles.textInputWrapperError : null,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Beber 2L de água, Meditar..."
                placeholderTextColor={THEME_COLORS.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (error) setError(null);
                }}
                autoFocus
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Seleção de Ícone */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecione um ícone</Text>
            <View style={styles.grid}>
              {AVAILABLE_ICONS.map((iconName) => {
                const isSelected = selectedIcon === iconName;
                return (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.gridIconButton,
                      isSelected && styles.gridIconButtonSelected,
                    ]}
                    onPress={() => setSelectedIcon(iconName)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={iconName}
                      size={22}
                      color={isSelected ? "#000000" : THEME_COLORS.text}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Seleção de Frequência Semanal (Dias da semana com seleção múltipla) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Frequência semanal</Text>
            <Text style={styles.helperText}>
              Selecione os dias em que você pretende realizar este hábito:
            </Text>
            <View style={styles.optionsRow}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                    onPress={() => toggleDay(day.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ height: 16 }} />

          {/* Botão Salvar Primário */}
          <PrimaryButton title="Cadastrar Hábito" onPress={handleSave} />

          <View style={{ height: 28 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    maxHeight: "92%",
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
  saveCheckButton: {
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
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLORS.text,
    marginBottom: 8,
  },
  textInputWrapper: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInputWrapperError: {
    borderColor: "#EF4444",
  },
  textInput: {
    fontSize: 15,
    color: THEME_COLORS.text,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
  },
  sectionContainer: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLORS.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: THEME_COLORS.textMuted,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  gridIconButtonSelected: {
    backgroundColor: THEME_COLORS.text,
    borderColor: THEME_COLORS.text,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: THEME_COLORS.surface,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  chipSelected: {
    backgroundColor: THEME_COLORS.text,
    borderColor: THEME_COLORS.text,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: THEME_COLORS.textMuted,
  },
  chipTextSelected: {
    color: "#000000",
    fontWeight: "700",
  },
});
