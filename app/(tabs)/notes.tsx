import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateNoteSheet } from "../../components/notes/CreateNoteSheet";
import { NoteCard } from "../../components/notes/NoteCard";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { THEME_COLORS } from "../../constants/theme";
import { useNotes } from "../../hooks/useNotes";
import { CATEGORY_CONFIG, CategoryKey } from "../../types/categories";

const CATEGORY_ORDER: CategoryKey[] = ["pessoal", "trabalho", "estudo"];

export default function NotesScreen() {
  const { notes, createNote } = useNotes();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Agrupamento por categoria e ordenação por createdAt decrescente
  const groupedNotes = useMemo(() => {
    const map: Record<CategoryKey, typeof notes> = {
      pessoal: [],
      trabalho: [],
      estudo: [],
    };

    const sorted = [...notes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const note of sorted) {
      if (map[note.category]) {
        map[note.category].push(note);
      }
    }

    return map;
  }, [notes]);

  const handleCreate = (title: string, category: CategoryKey) => {
    const note = createNote({ title, category });
    router.push(`/note/${note.id}` as any);
  };

  const handleOpenNote = (id: string) => {
    router.push(`/note/${id}` as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho de Notas */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsCreateOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Lista agrupada por categoria */}
        {notes.length > 0 ? (
          CATEGORY_ORDER.map((catKey) => {
            const catNotes = groupedNotes[catKey];
            if (!catNotes || catNotes.length === 0) return null;

            return (
              <View key={catKey} style={styles.section}>
                <SectionHeader
                  title={CATEGORY_CONFIG[catKey].label}
                  count={catNotes.length}
                />

                {catNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onPress={handleOpenNote}
                  />
                ))}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color="#333"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>Nenhuma nota ainda</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão + acima para criar sua primeira nota.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal Bottom Sheet de Criação */}
      <CreateNoteSheet
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 140, // Espaço para não cobrir itens atrás da barra flutuante
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 16,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#1E1E1E",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 26,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtitle: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
