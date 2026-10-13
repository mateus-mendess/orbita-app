const SHORT_MONTHS_PT_BR = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "mai.",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];

export function formatNoteDate(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = SHORT_MONTHS_PT_BR[d.getMonth()];
  const currentYear = new Date().getFullYear();
  if (d.getFullYear() === currentYear) {
    return `${day} de ${month}`;
  }
  return `${day} de ${month} de ${d.getFullYear()}`;
}

export function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/- \[[ x]\] /g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function toggleChecklistAtLine(content: string, targetLineIndex: number): string {
  const lines = content.split("\n");
  if (targetLineIndex < 0 || targetLineIndex >= lines.length) return content;

  const line = lines[targetLineIndex];
  if (line.startsWith("- [ ] ")) {
    lines[targetLineIndex] = "- [x] " + line.slice(6);
  } else if (line.startsWith("- [x] ")) {
    lines[targetLineIndex] = "- [ ] " + line.slice(6);
  }

  return lines.join("\n");
}

export function applyMarkdownAction(
  content: string,
  selection: { start: number; end: number },
  action: "bold" | "checklist"
): { newContent: string; newSelection?: { start: number; end: number } } {
  const { start, end } = selection;

  if (action === "bold") {
    if (start === end) {
      const before = content.slice(0, start);
      const after = content.slice(end);
      return {
        newContent: before + "****" + after,
        newSelection: { start: start + 2, end: start + 2 },
      };
    }

    const selectedText = content.slice(start, end);
    if (selectedText.startsWith("**") && selectedText.endsWith("**") && selectedText.length >= 4) {
      // Remove bold
      const unwrapped = selectedText.slice(2, -2);
      return {
        newContent: content.slice(0, start) + unwrapped + content.slice(end),
        newSelection: { start, end: start + unwrapped.length },
      };
    }

    const wrapped = `**${selectedText}**`;
    return {
      newContent: content.slice(0, start) + wrapped + content.slice(end),
      newSelection: { start, end: start + wrapped.length },
    };
  }

  // Checklist action: opera na linha atual
  const lineStart = content.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = content.indexOf("\n", start);
  const lineEnd = lineEndIdx === -1 ? content.length : lineEndIdx;
  const currentLine = content.slice(lineStart, lineEnd);

  let updatedLine = currentLine;
  let offsetDelta = 0;

  if (currentLine.startsWith("- [ ] ")) {
    updatedLine = currentLine.slice(6);
    offsetDelta = -6;
  } else if (currentLine.startsWith("- [x] ")) {
    updatedLine = currentLine.slice(6);
    offsetDelta = -6;
  } else {
    updatedLine = "- [ ] " + currentLine;
    offsetDelta = 6;
  }

  const newContent = content.slice(0, lineStart) + updatedLine + content.slice(lineEnd);
  const newPos = Math.max(lineStart, start + offsetDelta);

  return {
    newContent,
    newSelection: { start: newPos, end: newPos },
  };
}

export function handleChecklistEnter(
  content: string,
  cursorPosition: number
): { newContent: string; newCursor: number } | null {
  const lineStart = content.lastIndexOf("\n", cursorPosition - 1) + 1;
  const currentLine = content.slice(lineStart, cursorPosition);

  // Se a linha de checklist estiver vazia ("- [ ] " ou "- [x] "), Enter sai da lista
  if (currentLine === "- [ ] " || currentLine === "- [x] ") {
    const newContent = content.slice(0, lineStart) + content.slice(cursorPosition);
    return {
      newContent,
      newCursor: lineStart,
    };
  }

  // Se a linha for uma checklist com conteúdo, continua na próxima linha
  if (currentLine.startsWith("- [ ] ") || currentLine.startsWith("- [x] ")) {
    const insert = "\n- [ ] ";
    const newContent =
      content.slice(0, cursorPosition) + insert + content.slice(cursorPosition);
    return {
      newContent,
      newCursor: cursorPosition + insert.length,
    };
  }

  return null;
}
