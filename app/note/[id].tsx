import {
  CoreBridge,
  editorHtml,
  RichText,
  TenTapStartKit,
  useBridgeState,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Share,
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
  convertMarkdownToHtml,
  formatNoteDate,
  htmlToPlainText,
} from "../../utils/markdown";

const INJECTED_CSS = `
  html, body {
    background-color: #000000 !important;
    color: #DDDDDD !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    font-size: 16px !important;
    line-height: 1.55 !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100% !important;
    height: 100% !important;
    caret-color: #FFFFFF !important;
  }
  .tiptap, .ProseMirror {
    min-height: 100% !important;
    padding: 12px 20px 100px 20px !important;
    outline: none !important;
    box-sizing: border-box !important;
  }
  ::selection {
    background: rgba(255, 255, 255, 0.25) !important;
  }
  p {
    margin: 4px 0 !important;
  }
  ul[data-type="taskList"] {
    list-style: none !important;
    padding: 0 !important;
    margin: 6px 0 !important;
  }
  li[data-type="taskItem"] {
    display: flex !important;
    align-items: flex-start !important;
    margin: 8px 0 !important;
  }
  li[data-type="taskItem"] > label {
    user-select: none !important;
    margin-right: 12px !important;
    margin-top: 2px !important;
    cursor: pointer !important;
  }
  li[data-type="taskItem"] input[type="checkbox"] {
    appearance: none !important;
    -webkit-appearance: none !important;
    width: 22px !important;
    height: 22px !important;
    border-radius: 50% !important;
    border: 2px solid #555555 !important;
    background-color: transparent !important;
    cursor: pointer !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    outline: none !important;
  }
  li[data-type="taskItem"][data-checked="true"] input[type="checkbox"],
  li[data-type="taskItem"] input[type="checkbox"]:checked {
    background-color: #FFFFFF !important;
    border-color: #FFFFFF !important;
  }
  li[data-type="taskItem"][data-checked="true"] input[type="checkbox"]::after,
  li[data-type="taskItem"] input[type="checkbox"]:checked::after {
    content: "" !important;
    width: 5px !important;
    height: 10px !important;
    border: solid #000000 !important;
    border-width: 0 2px 2px 0 !important;
    transform: rotate(45deg) translate(-1px, -1px) !important;
    display: block !important;
  }
  li[data-type="taskItem"][data-checked="true"] > div,
  li[data-type="taskItem"] input[type="checkbox"]:checked ~ div {
    text-decoration: line-through !important;
    opacity: 0.5 !important;
  }
`;

const CUSTOM_EDITOR_SOURCE = editorHtml.replace(
  "</head>",
  `<style id="orbita-theme">${INJECTED_CSS}</style></head>`
);

const BRIDGE_EXTENSIONS = [
  ...TenTapStartKit.filter((b) => b.name !== "coreBridge"),
  CoreBridge.configureCSS(INJECTED_CSS),
];

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, updateNote, deleteNote } = useNotes();

  const note = getNoteById(id || "");

  const [title, setTitle] = useState(note?.title || "");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Monitora abertura/fechamento do teclado
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Migra notas legadas salvas em markdown para HTML na primeira abertura
  const initialHtml = useMemo(() => {
    const raw = note?.content || "";
    if (!raw.trim()) return "<p></p>";
    if (!raw.trim().startsWith("<")) {
      return convertMarkdownToHtml(raw);
    }
    return raw;
  }, [note?.id]);

  // Persiste a migração de notas legadas de markdown para HTML após renderização
  useEffect(() => {
    const raw = note?.content || "";
    if (raw && !raw.trim().startsWith("<") && id) {
      updateNote(id, { content: convertMarkdownToHtml(raw) });
    }
  }, [id, note?.content, updateNote]);

  const editor = useEditorBridge({
    bridgeExtensions: BRIDGE_EXTENSIONS,
    initialContent: initialHtml,
    customSource: CUSTOM_EDITOR_SOURCE,
    autofocus: !note?.content,
    avoidIosKeyboard: true,
    theme: {
      webview: { backgroundColor: "#000000" },
      webviewContainer: { backgroundColor: "#000000" },
    },
  });

  const editorState = useBridgeState(editor);

  // Sincroniza conteúdo com debounce de 400ms nativo do TenTap
  const editorHtml = useEditorContent(editor, {
    type: "html",
    debounceInterval: 400,
  });

  useEffect(() => {
    if (editorHtml !== undefined && id) {
      updateNote(id, { content: editorHtml });
    }
  }, [editorHtml, id, updateNote]);

  // Salva no ciclo de vida ao ir para segundo plano
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state !== "active" && id) {
        try {
          const current = await editor.getHTML();
          if (current) updateNote(id, { title, content: current });
        } catch {}
      }
    });
    return () => sub.remove();
  }, [id, title, editor, updateNote]);

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

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (id) updateNote(id, { title: newTitle });
  };

  const handleBack = async () => {
    try {
      const current = await editor.getHTML();
      if (id && current) updateNote(id, { title, content: current });
    } catch {}
    router.back();
  };

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

  const handleShare = async () => {
    let htmlContent = "";
    try {
      htmlContent = (await editor.getHTML()) || note.content;
    } catch {
      htmlContent = note.content;
    }

    const plainBody = htmlToPlainText(htmlContent, true);
    if (!title.trim() && !plainBody.trim()) return;

    const message = title.trim()
      ? `${title.trim()}\n\n${plainBody}`
      : plainBody;

    try {
      await Share.share({ message });
    } catch {}
  };

  const categoryLabel = CATEGORY_CONFIG[note.category]?.label || "Geral";
  const dateLabel = formatNoteDate(note.createdAt);
  const hasContent = Boolean(title.trim() || note.content.trim());

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={12}
          style={styles.headerBackBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerActionsRight}>
          {/* Desfazer: 48pt, ícone minimalista 24pt */}
          <TouchableOpacity
            onPress={() => editor.undo()}
            disabled={!editorState.canUndo}
            hitSlop={8}
            style={[
              styles.headerCircleBtn,
              !editorState.canUndo && styles.headerBtnDisabled,
            ]}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={24}
              color={editorState.canUndo ? "#FFF" : "#666"}
            />
          </TouchableOpacity>

          {/* Compartilhar: 48pt, ícone 24pt */}
          <TouchableOpacity
            onPress={handleShare}
            disabled={!hasContent}
            hitSlop={8}
            style={[
              styles.headerCircleBtn,
              !hasContent && styles.headerBtnDisabled,
            ]}
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={hasContent ? "#FFF" : "#666"}
            />
          </TouchableOpacity>

          {/* Excluir: 48pt, ícone 24pt */}
          <TouchableOpacity
            onPress={handleDelete}
            hitSlop={8}
            style={styles.headerCircleBtn}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Título e Metadados Nativos */}
      <View style={styles.metaContainer}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Título"
          placeholderTextColor="#555"
          multiline
        />
        <Text style={styles.subtitle}>
          {categoryLabel} · Criada em {dateLabel}
        </Text>
        <View style={styles.divider} />
      </View>

      {/* Editor Sempre Editável (TenTap RichText) */}
      <View style={styles.editorWrapper}>
        <RichText
          editor={editor}
          style={styles.richText}
          containerStyle={styles.richTextContainer}
        />
      </View>

      {/* Barra de Ferramentas Compacta (Visível apenas com Teclado Aberto) */}
      {keyboardVisible ? (
        <View style={styles.toolbarContainer}>
          <View style={styles.mainToolbar}>
            <TouchableOpacity
              style={[
                styles.toolBtn,
                editorState.isBoldActive && styles.toolBtnActive,
              ]}
              onPress={() => editor.toggleBold()}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.boldBtnText,
                  editorState.isBoldActive && styles.toolTextActive,
                ]}
              >
                B
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolBtn,
                editorState.isUnderlineActive && styles.toolBtnActive,
              ]}
              onPress={() => editor.toggleUnderline()}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.underlineBtnText,
                  editorState.isUnderlineActive && styles.toolTextActive,
                ]}
              >
                U
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolBtn,
                editorState.isTaskListActive && styles.toolBtnActive,
              ]}
              onPress={() => editor.toggleTaskList()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="checkbox-outline"
                size={22}
                color={editorState.isTaskListActive ? "#FFF" : "#BBB"}
              />
            </TouchableOpacity>

            <View style={styles.toolDivider} />

            <TouchableOpacity
              style={styles.toolBtn}
              onPress={() => Keyboard.dismiss()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-down" size={20} color="#AAA" />
            </TouchableOpacity>
          </View>
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
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1E1E1E",
  },
  headerBackBtn: {
    padding: 6,
  },
  headerActionsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2E2E2E",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnDisabled: {
    opacity: 0.35,
  },
  metaContainer: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  titleInput: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
    padding: 0,
  },
  subtitle: {
    color: "#888",
    fontSize: 13,
    marginBottom: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#222",
  },
  editorWrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  richText: {
    backgroundColor: "#000",
  },
  richTextContainer: {
    backgroundColor: "#000",
  },
  toolbarContainer: {
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  mainToolbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#262626",
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  toolBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  toolBtnActive: {
    backgroundColor: "#2E2E2E",
  },
  toolDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#2E2E2E",
    marginHorizontal: 2,
  },
  boldBtnText: {
    color: "#BBB",
    fontSize: 16,
    fontWeight: "800",
  },
  underlineBtnText: {
    color: "#BBB",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  toolTextActive: {
    color: "#FFF",
  },
  errorText: {
    color: "#888",
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
