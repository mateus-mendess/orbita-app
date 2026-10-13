import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Note } from "../../types/notes";
import { formatNoteDate, stripMarkdown } from "../../utils/markdown";

interface NoteCardProps {
  note: Note;
  onPress: (id: string) => void;
}

export const NoteCard = React.memo<NoteCardProps>(({ note, onPress }) => {
  const preview = stripMarkdown(note.content);
  const formattedDate = formatNoteDate(note.createdAt);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => onPress(note.id)}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        {formattedDate ? (
          <Text style={styles.dateText}>{formattedDate}</Text>
        ) : null}
      </View>

      {preview ? (
        <Text style={styles.preview} numberOfLines={2}>
          {preview}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#161616",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#262626",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    flex: 1,
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 12,
  },
  dateText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "400",
  },
  preview: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
  },
});
