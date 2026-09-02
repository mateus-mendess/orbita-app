import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    UIManager,
    View,
} from "react-native";
import { AuthInput } from "../components/(auth)/AuthInput";
import { FieldRow } from "../components/shared/FieldRow";
import { ModalHeader } from "../components/shared/ModalHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { useTasks } from "../hooks/useTasks";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [time, setTime] = useState(new Date());
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const [priority, setPriority] = useState("");

  const { addTask } = useTasks();

  const handleSave = () => {
    addTask({ title, description, date, time, priority });
    router.back();
  };

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = time.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const toggleDatePicker = () => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsDateOpen(!isDateOpen);
      if (!isDateOpen) setIsTimeOpen(false);
    }, 50);
  };

  const toggleTimePicker = () => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsTimeOpen(!isTimeOpen);
      if (!isTimeOpen) setIsDateOpen(false);
    }, 50);
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.sheet}>
        <ModalHeader title="Nova Tarefa" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AuthInput
            label="Título"
            iconName="document-text-outline"
            placeholder="Ex: Pagar o aluguel"
            value={title}
            onChangeText={setTitle}
          />

          <AuthInput
            label="Descrição"
            iconName="text-outline"
            placeholder="Adicione detalhes..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.gap} />

          <FieldRow
            iconName="calendar-outline"
            label="Data"
            value={formattedDate}
            isExpanded={isDateOpen}
            onPress={toggleDatePicker}
          >
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                themeVariant="dark"
                textColor="#FFFFFF"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                  if (Platform.OS === "android") {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setIsDateOpen(false);
                  }
                }}
              />
            </View>
          </FieldRow>

          <FieldRow
            iconName="time-outline"
            label="Hora"
            value={formattedTime}
            isExpanded={isTimeOpen}
            onPress={toggleTimePicker}
          >
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                themeVariant="dark"
                textColor="#FFFFFF"
                onChange={(event, selectedTime) => {
                  if (selectedTime) setTime(selectedTime);
                  if (Platform.OS === "android") {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setIsTimeOpen(false);
                  }
                }}
              />
            </View>
          </FieldRow>

          <FieldRow
            iconName="flag-outline"
            label="Nível de importância"
            value={priority || "Selecionar"}
            onPress={() => setPriority("Alta")}
          />

          <View style={styles.buttonContainer}>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#000000",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    maxHeight: "90%",
    paddingBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  gap: {
    height: 16,
  },
  pickerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 32,
  },
});
