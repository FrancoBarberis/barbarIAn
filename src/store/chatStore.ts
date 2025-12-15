
import { create } from "zustand";
import type { Chat, Message, Role } from "../types/messageType";

type ChatState = {
  chats: Chat[];
  selectedChatId: string | null;
  selectChat: (chatId: string) => void;
  createChat: (title: string) => string;
  sendMessage: (text: string, role?: Role) => void;
  getSelectedChat: () => Chat | null;
  deleteChat: (chatId: string) => void; // <-- nuevo método
  editChat: (chatId: string, newTitle: string) => void; // <-- nuevo método
};

// INICIALIZO LOS CHATS EN VACÍO
const initialChats: Chat[] = [];

export const useChatStore = create<ChatState>((set, get) => ({
  chats: initialChats,
  selectedChatId: initialChats[0]?.id ?? null,

  selectChat: (chatId) => set({ selectedChatId: chatId }),

  createChat: (title) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const newChat: Chat = { id, title, messages: [] };
    set((state) => ({ chats: [newChat, ...state.chats], selectedChatId: id }));
    return id;
  },

  sendMessage: (text, role = "user") => {
    const trimmed = text.trim();
    const chatId = get().selectedChatId;
    if (!trimmed || !chatId) return;

    const newMsg: Message = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      chatId,
      role,
      text: trimmed,
      timestamp: Date.now(),
    };

    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c
      ),
    }));
  },

  getSelectedChat: () => {
    const { chats, selectedChatId } = get();
    return chats.find((c) => c.id === selectedChatId) ?? null;
  },

  deleteChat: (chatId) => {
    set((state) => {
      const updatedChats = state.chats.filter((c) => c.id !== chatId);
      return {
        chats: updatedChats,
        selectedChatId:
          state.selectedChatId === chatId
            ? updatedChats[0]?.id ?? null
            : state.selectedChatId,
      };
    });
  },
  editChat: (chatId, newTitle) => {
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, title: newTitle } : c
      ),
    }));
  }
}));
