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

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Converte HTML para texto simples:
 * - Para prévia (includeCheckboxes = false): texto corrido limpo sem tags, até 2 linhas.
 * - Para compartilhar (includeCheckboxes = true): parágrafos separados por linha, itens de checklist como ☐ e ☑.
 */
export function htmlToPlainText(
  html: string,
  includeCheckboxes: boolean = false
): string {
  if (!html) return "";

  if (!includeCheckboxes) {
    const clean = html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return decodeHtmlEntities(clean);
  }

  const text = html
    .replace(/<li[^>]*data-checked="true"[^>]*>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/li>/gi, "☑ $1\n")
    .replace(/<li[^>]*data-checked="false"[^>]*>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/li>/gi, "☐ $1\n")
    .replace(/<li[^>]*>[\s\S]*?<input[^>]*checked[^>]*>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/li>/gi, "☑ $1\n")
    .replace(/<li[^>]*>[\s\S]*?<input[^>]*>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/li>/gi, "☐ $1\n")
    .replace(/<p>(.*?)<\/p>/gi, "$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  const lines = text
    .split("\n")
    .map((l) => decodeHtmlEntities(l.trim()))
    .filter(Boolean);

  return lines.join("\n");
}

/**
 * Converte notas antigas salvas em markdown para HTML na primeira abertura.
 */
export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return "<p></p>";
  if (markdown.trim().startsWith("<")) return markdown;

  const lines = markdown.split("\n");
  const htmlParts: string[] = [];
  let inTaskList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inTaskList) {
        htmlParts.push("</ul>");
        inTaskList = false;
      }
      continue;
    }

    const isChecklistOpen = line.startsWith("- [ ] ");
    const isChecklistDone = line.startsWith("- [x] ");

    if (isChecklistOpen || isChecklistDone) {
      if (!inTaskList) {
        htmlParts.push('<ul data-type="taskList">');
        inTaskList = true;
      }
      const rawText = line.slice(6);
      const textWithBold = rawText.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      const checkedAttr = isChecklistDone ? ' data-checked="true"' : ' data-checked="false"';
      htmlParts.push(
        `<li data-type="taskItem"${checkedAttr}><label><input type="checkbox"${isChecklistDone ? ' checked="checked"' : ""}></label><div><p>${textWithBold}</p></div></li>`
      );
    } else {
      if (inTaskList) {
        htmlParts.push("</ul>");
        inTaskList = false;
      }
      const cleanLine = line
        .replace(/^#{1,3}\s+/, "")
        .replace(/^-\s+/, "")
        .replace(/^\d+\.\s+/, "");
      const textWithBold = cleanLine.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      htmlParts.push(`<p>${textWithBold}</p>`);
    }
  }

  if (inTaskList) {
    htmlParts.push("</ul>");
  }

  return htmlParts.join("");
}
