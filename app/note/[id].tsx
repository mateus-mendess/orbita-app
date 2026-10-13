import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
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
import { THEME_COLORS } from "../../constants/theme";
import { useNotes } from "../../hooks/useNotes";
import { CATEGORY_CONFIG } from "../../types/categories";
import {
  applyMarkdownAction,
  formatNoteDate,
  handleChecklistEnter,
  toggleChecklistAtLine,
} from "../../utils/markdown";

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, updateNote, deleteNote } = useNotes();

  const note = getNoteById(id || "");

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isEditing, setIsEditing] = useState(() => !note?.content);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const inputRef = useRef<TextInput>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza se a nota mudar externamente
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note?.id]);

  const saveToGlobal = useCallback(
    (newTitle: string, newContent: string) => {
      if (!id) return;
      updateNote(id, { title: newTitle, content: newContent });
    },
    [id, updateNote]
  );

  const scheduleSave = (newTitle: string, newContent: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToGlobal(newTitle, newContent);
    }, 400);
  };

  // Salva ao desmontar da tela
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveToGlobal(title, content);
    };
  }, [title, content, saveToGlobal]);

  // Salva se o app for para segundo plano
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        saveToGlobal(title, content);
      }
    });
    return () => sub.remove();
  }, [title, content, saveToGlobal]);

  if (!note) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Nota não encontrada</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Excluir nota", "Tem certeza que deseja excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deleteNote(note.id);
          router.back();
        },
      },
    ]);
  };

  const handleBack = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveToGlobal(title, content);
    router.back();
  };

  const handleDone = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveToGlobal(title, content);
    setIsEditing(false);
  };

  const handleContentChange = (text: string) => {
    // Detecta se acabou de pressionar Enter numa linha de checklist
    if (
      text.length === content.length + 1 &&
      text[selection.start] === "\n"
    ) {
      const enterResult = handleChecklistEnter(content, selection.start);
      if (enterResult) {
        setContent(enterResult.newContent);
        scheduleSave(title, enterResult.newContent);
        return;
      }
    }

    setContent(text);
    scheduleSave(title, text);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    scheduleSave(newTitle, content);
  };

  const handleBold = () => {
    const result = applyMarkdownAction(content, selection, "bold");
    setContent(result.newContent);
    scheduleSave(title, result.newContent);
  };

  const handleChecklist = () => {
    const result = applyMarkdownAction(content, selection, "checklist");
    setContent(result.newContent);
    scheduleSave(title, result.newContent);
  };

  // Alterna checkbox no modo leitura sem entrar em edição
  const handleToggleChecklist = (lineIndex: number) => {
    const updated = toggleChecklistAtLine(content, lineIndex);
    setContent(updated);
    saveToGlobal(title, updated);
  };

  const categoryLabel = CATEGORY_CONFIG[note.category]?.label || "Geral";
  const dateLabel = formatNoteDate(note.createdAt);

  // Renderiza negrito com split por regex
  const renderBoldSegments = (text: string, isChecked: boolean) => {
    const segments = text.split(/(\*\*[^*]+\*\*)/g);
    return segments.map((seg, idx) => {
      if (seg.startsWith("**") && seg.endsWith("**") && seg.length >= 4) {
        return (
          <Text
            key={idx}
            style={[
              styles.boldText,
              isChecked && styles.itemTextChecked,
            ]}
          >
            {seg.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={idx}>{seg}</Text>;
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={10}
          style={styles.headerAction}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {isEditing ? (
            <TouchableOpacity onPress={handleDone} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Concluir</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleDelete}
            hitSlop={10}
            style={[styles.headerAction, { marginLeft: 12 }]}
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Corpo da Nota */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Título"
          placeholderTextColor="#555"
          multiline
        />

        {/* Metadados: Categoria e Data */}
        <Text style={styles.subtitle}>
          {categoryLabel} · Criada em {dateLabel}
        </Text>

        <View style={styles.divider} />

        {/* Conteúdo: Modo Edição ou Leitura */}
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.contentInput}
            value={content}
            onChangeText={handleContentChange}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            placeholder="Comece a escrever..."
            placeholderTextColor="#555"
            multiline
            autoFocus={!content}
          />
        ) : (
          <View style={styles.readContainer}>
            {content.split("\n").map((line, lineIdx) => {
              if (!line.trim()) {
                return <View key={lineIdx} style={{ height: 12 }} />;
              }

              const isChecklist =
                line.startsWith("- [ ] ") || line.startsWith("- [x] ");
              const isChecked = line.startsWith("- [x] ");

              if (isChecklist) {
                const itemText = line.slice(6);
                return (
                  <View key={lineIdx} style={styles.checklistRow}>
                    <Pressable
                      hitSlop={8}
                      style={styles.checkboxTouch}
                      onPress={() => handleToggleChecklist(lineIdx)}
                    >
                      <Ionicons
                        name={isChecked ? "checkmark-circle" : "ellipse-outline"}
                        size={22}
                        color={isChecked ? "#FFFFFF" : "#555"}
                      />
                    </Pressable>
                    <Pressable
                      style={styles.checklistTextWrapper}
                      onPress={() => setIsEditing(true)}
                    >
                      <Text
                        style={[
                          styles.checklistText,
                          isChecked && styles.itemTextChecked,
                        ]}
                      >
                        {renderBoldSegments(itemText, isChecked)}
                      </Text>
                    </Pressable>
                  </View>
                );
              }

              return (
                <Pressable
                  key={lineIdx}
                  onPress={() => setIsEditing(true)}
                  style={styles.paragraphPressable}
                >
                  <Text style={styles.paragraphText}>
                    {renderBoldSegments(line, false)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Barra de Ferramentas (Modo Edição) */}
      {isEditing ? (
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={handleBold}
            activeOpacity={0.7}
          >
            <Text style={styles.boldIconText}>B</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={handleChecklist}
            activeOpacity={0.7}
          >
            <Ionicons name="checkbox-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1E1E1E",
  },
  headerAction: {
    padding: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  doneBtn: {
    backgroundColor: "#FFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  doneBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 13,
  },
  editBtn: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  editBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  titleInput: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
    padding: 0,
  },
  subtitle: {
    color: "#888",
    fontSize: 13,
    marginBottom: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#222",
    marginBottom: 20,
  },
  contentInput: {
    color: "#DDD",
    fontSize: 16,
    lineHeight: 24,
    minHeight: 250,
    padding: 0,
    textAlignVertical: "top",
  },
  readContainer: {
    minHeight: 250,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkboxTouch: {
    marginRight: 10,
    marginTop: 1,
  },
  checklistTextWrapper: {
    flex: 1,
  },
  checklistText: {
    color: "#DDD",
    fontSize: 16,
    lineHeight: 24,
  },
  itemTextChecked: {
    textDecorationLine: "line-through",
    color: "#666",
    opacity: 0.6,
  },
  paragraphPressable: {
    marginBottom: 10,
  },
  paragraphText: {
    color: "#DDD",
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "700",
    color: "#FFF",
  },
  toolbar: {
    flexDirection: "row",
    backgroundColor: "#161616",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#262626",
    gap: 16,
  },
  toolbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
  },
  boldIconText: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 16,
  },
  errorText: {
    color: "#888",
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backBtnText: {
    color: "#000",
    fontWeight: "700",
  },
});
