
// store/chatStore.ts
import { create } from "zustand";
import type { Chat, Message, Role } from "../types/messageType";

type ChatState = {
  chats: Chat[];
  selectedChatId: string | null;
  selectChat: (chatId: string) => void;
  createChat: (title: string) => string;
  sendMessage: (text: string, role?: Role) => void;
  getSelectedChat: () => Chat | null;
};

const initialChats: Chat[] = [
  { id: "chat-1", title: "General", messages: [] },
  { id: "chat-2", title: "Soporte", messages: [] },
];

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
}));
