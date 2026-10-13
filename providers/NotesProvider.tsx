import React, { createContext, useCallback, useContext, useState } from "react";
import { CategoryKey } from "../types/categories";
import { Note } from "../types/notes";

interface CreateNoteInput {
  title: string;
  category: CategoryKey;
  content?: string;
}

interface NotesContextData {
  notes: Note[];
  createNote: (input: CreateNoteInput) => Note;
  updateNote: (id: string, updates: Partial<Pick<Note, "title" | "category" | "content">>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Lista de livros 2026",
    category: "pessoal",
    content: `Livros pra ler em 2026\n\nPuxando a meta de **Ler 10 livros** no ano.\n\n- [x] Hábitos Atômicos — James Clear\n- [x] O Poder do Agora — Eckhart Tolle\n- [x] Essencialismo — Greg McKeown\n- [ ] Rápido e Devagar — Daniel Kahneman\n- [ ] Mindset — Carol Dweck\n- [x] Aula de conversação em inglês`,
    createdAt: new Date(2026, 6, 18, 14, 30).toISOString(), // 18 de jul.
    updatedAt: new Date(2026, 6, 18, 15, 0).toISOString(),
  },
  {
    id: "note-2",
    title: "Projeto moop — roadmap",
    category: "trabalho",
    content: `Roadmap do trimestre Prioridades pra fechar o MVP até o fim do mês.\n\n- [x] Desenhar fluxo de onboarding\n- [ ] Integrar checkout da Stripe\n- [ ] Testes de carga na API`,
    createdAt: new Date(2026, 6, 18, 10, 0).toISOString(),
    updatedAt: new Date(2026, 6, 18, 10, 0).toISOString(),
  },
  {
    id: "note-3",
    title: "Reunião semanal — 15/07",
    category: "trabalho",
    content: `Alinhamento com o time de engenharia sobre prazos do sprint e métricas de desempenho.`,
    createdAt: new Date(2026, 6, 15, 9, 30).toISOString(),
    updatedAt: new Date(2026, 6, 15, 9, 30).toISOString(),
  },
  {
    id: "note-4",
    title: "Ideias de features",
    category: "trabalho",
    content: `Backlog de ideias: Modo foco com timer, exportação de tarefas em PDF e atalhos rápidos.`,
    createdAt: new Date(2026, 6, 13, 16, 45).toISOString(),
    updatedAt: new Date(2026, 6, 13, 16, 45).toISOString(),
  },
  {
    id: "note-5",
    title: "Presentes de aniversário",
    category: "pessoal",
    content: `Ideias pro aniversário da mãe no mês que vem: cafeteira italiana ou kindle.`,
    createdAt: new Date(2026, 6, 12, 11, 20).toISOString(),
    updatedAt: new Date(2026, 6, 12, 11, 20).toISOString(),
  },
  {
    id: "note-6",
    title: "Receita de bolo de cenoura",
    category: "pessoal",
    content: `Bolo de cenoura Ingredientes: 3 cenouras, 4 ovos, 2 xícaras de açúcar e calda de chocolate.`,
    createdAt: new Date(2026, 5, 25, 18, 10).toISOString(), // 25 de jun.
    updatedAt: new Date(2026, 5, 25, 18, 10).toISOString(),
  },
  {
    id: "note-7",
    title: "Anotações de TypeScript",
    category: "estudo",
    content: `Resumo sobre **Generics** e **Conditional Types** em React Native.`,
    createdAt: new Date(2026, 6, 10, 8, 0).toISOString(),
    updatedAt: new Date(2026, 6, 10, 8, 0).toISOString(),
  },
];

const NotesContext = createContext<NotesContextData>({} as NotesContextData);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  const createNote = useCallback((input: CreateNoteInput): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: "note-" + Date.now(),
      title: input.title.trim(),
      category: input.category,
      content: input.content || "",
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "category" | "content">>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                ...updates,
                title: updates.title !== undefined ? updates.title.trim() : n.title,
                updatedAt: new Date().toISOString(),
              }
            : n
        )
      );
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNoteById = useCallback(
    (id: string) => {
      return notes.find((n) => n.id === id);
    },
    [notes]
  );

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, deleteNote, getNoteById }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
