import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORY_CONFIG, CategoryKey } from "../../types/categories";
import { PrimaryButton } from "../shared/PrimaryButton";

interface CreateNoteSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, category: CategoryKey) => void;
}

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map((key) => ({
  key,
  ...CATEGORY_CONFIG[key],
}));

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const CreateNoteSheet: React.FC<CreateNoteSheetProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryKey>("pessoal");
  const [error, setError] = useState<string | null>(null);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setTitle("");
      setCategory("pessoal");
      setError(null);
      translateY.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 3,
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

  const handleCreate = () => {
    if (!title.trim()) {
      setError("Por favor, digite o nome da nota.");
      return;
    }
    onCreate(title.trim(), category);
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Nova Nota</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Lista de livros 2026"
              placeholderTextColor="#555"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (error) setError(null);
              }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={[styles.label, { marginTop: 16 }]}>Categoria</Text>
            <View style={styles.chipsRow}>
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = opt.key === category;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.7}
                    style={[
                      styles.chip,
                      isSelected && {
                        backgroundColor: "#262626",
                        borderColor: opt.color,
                      },
                    ]}
                    onPress={() => setCategory(opt.key)}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={15}
                      color={opt.color}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && { color: opt.color, fontWeight: "700" },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ marginTop: 24 }}>
              <PrimaryButton title="Criar" onPress={handleCreate} />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
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
    backgroundColor: "#161616",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#262626",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {},
  label: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  chipText: {
    color: "#AAA",
    fontSize: 13,
    fontWeight: "500",
  },
});
