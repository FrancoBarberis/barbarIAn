import { create } from "zustand";
import type { Chat, Message, Role } from "../types/messageType";
import { useUIStore } from "./uiStore";

// Helpers de Local Storage
const LS_KEYS = {
  chats: "chats",
  selectedChatId: "selectedChatId",
} as const;

function readChatsFromLS(): Chat[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.chats);
    return raw ? (JSON.parse(raw) as Chat[]) : [];
  } catch {
    // Si el JSON está corrupto, volvemos a []
    return [];
  }
}

function saveChatsToLS(chats: Chat[]) {
  localStorage.setItem(LS_KEYS.chats, JSON.stringify(chats));
}

function readSelectedIdFromLS(): string | null {
  return localStorage.getItem(LS_KEYS.selectedChatId);
}

function saveSelectedIdToLS(id: string | null) {
  if (id) localStorage.setItem(LS_KEYS.selectedChatId, id);
  else localStorage.removeItem(LS_KEYS.selectedChatId);
}

// Hidratar estado inicial desde LS
const initialChats: Chat[] = readChatsFromLS();
const initialSelectedId: string | null =
  readSelectedIdFromLS() ?? initialChats[0]?.id ?? null;
const initialMessages =
  initialSelectedId
    ? initialChats.find((c) => c.id === initialSelectedId)?.messages ?? []
    : [];

const setThinking = useUIStore.getState().setThinking;

type ChatState = {
  chats: Chat[];
  selectedChatId: string | null;
  messagesList: Message[];
  noMessages: boolean;

  selectChat: (chatId: string) => void;
  createChat: (title: string) => string;
  sendMessage: (text: string, role?: Role) => Promise<void>;
  getSelectedChat: () => Chat | null;
  deleteChat: (chatId: string) => void;
  editChat: (chatId: string, newTitle: string) => void;
};

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: initialChats,
  selectedChatId: initialSelectedId,
  messagesList: initialMessages,
  noMessages: initialMessages.length === 0,

  selectChat: (chatId) =>
    set((state) => {
      const chat = state.chats.find((c) => c.id === chatId);
      const newMessages = chat?.messages ?? [];
      saveSelectedIdToLS(chatId);
      return {
        selectedChatId: chatId,
        messagesList: messages,
        noMessages: messages.length === 0,
      };
    }),

  createChat: (title) => {
    const id = crypto.randomUUID();
    const newChat: Chat = { id, title, messages: [] };

    set((state) => {
      const updatedChats = [newChat, ...state.chats];
      saveChatsToLS(updatedChats);
      saveSelectedIdToLS(id);

      return {
        chats: updatedChats,
        selectedChatId: id,
        messagesList: [],
        noMessages: true, // nuevo chat -> sin mensajes
      };
    });

    return id;
  },

  // Usar este método tanto para "enviar" (role: 'user') como para "recibir" (role: 'assistant')
  sendMessage: (text, role = "user") => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let chatId = get().selectedChatId;
    if (!chatId) {
      // crear chat con título corto derivado del primer mensaje
      chatId = get().createChat(
        trimmed.length > 20 ? trimmed.slice(0, 20) + "..." : trimmed
      );
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      chatId,
      role,
      text: trimmed,
      timestamp: Date.now(),
    };

    // 1️⃣ mensaje del usuario
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c
      ),
      messagesList:
        state.selectedChatId === chatId
          ? [...state.messagesList, userMsg]
          : state.messagesList,
      noMessages: false,
    }));

    // 2️⃣ mensaje temporal del assistant
    const tempAssistantMsg: Message = {
      id: "assistant-thinking",
      chatId,
      role: "assistant",
      text: "...",
      timestamp: Date.now(),
    };

    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, tempAssistantMsg] }
          : c
      ),
      messagesList:
        state.selectedChatId === chatId
          ? [...state.messagesList, tempAssistantMsg]
          : state.messagesList,
    }));

    setThinking(true);

    set((state) => {
      // Actualizar el chat con el nuevo mensaje
      const updatedChats = state.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c
      );

      // ✅ Persistir en Local Storage
      saveChatsToLS(updatedChats);

      // Reflejar en la lista visible si es el chat seleccionado
      const isSelected = state.selectedChatId === chatId;
      const updatedMessagesList = isSelected
        ? [...state.messagesList, newMsg]
        : state.messagesList;

      return {
        chats: updatedChats,
        messagesList: updatedMessagesList,
        noMessages: updatedMessagesList.length === 0,
      };
    });

    setTimeout(() => {
      setThinking(false);
    }
  },

  getSelectedChat: () => {
    const { chats, selectedChatId } = get();
    return chats.find((c) => c.id === selectedChatId) ?? null;
  },

  deleteChat: (chatId) =>
    set((state) => {
      const chats = state.chats.filter((c) => c.id !== chatId);
      const selectedChatId =
        state.selectedChatId === chatId ? chats[0]?.id ?? null : state.selectedChatId;

      const newMessages =
        newSelectedId
          ? updatedChats.find((c) => c.id === newSelectedId)?.messages ?? []
          : [];

      // ✅ Persistir cambios
      saveChatsToLS(updatedChats);
      saveSelectedIdToLS(newSelectedId);

      return {
        chats,
        selectedChatId,
        messagesList: messages,
        noMessages: messages.length === 0,
      };
    }),

  editChat: (chatId, newTitle) =>
    set((state) => {
      const updatedChats = state.chats.map((c) =>
        c.id === chatId ? { ...c, title: newTitle } : c
      );

      // ✅ Persistir cambios
      saveChatsToLS(updatedChats);

      return { chats: updatedChats };
    }),
}));
