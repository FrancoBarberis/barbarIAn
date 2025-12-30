import { create } from "zustand";
import type { Chat, Message, Role } from "../types/messageType";
import { useUIStore } from "./uiStore";

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

const initialChats: Chat[] = [];
const setThinking = useUIStore.getState().setThinking;

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: initialChats,
  selectedChatId: null,
  messagesList: [],
  noMessages: true,

  selectChat: (chatId) =>
    set((state) => {
      const chat = state.chats.find((c) => c.id === chatId);
      const messages = chat?.messages ?? [];
      return {
        selectedChatId: chatId,
        messagesList: messages,
        noMessages: messages.length === 0,
      };
    }),

  createChat: (title) => {
    const id = crypto.randomUUID();
    const newChat: Chat = { id, title, messages: [] };

    set((state) => ({
      chats: [newChat, ...state.chats],
      selectedChatId: id,
      messagesList: [],
      noMessages: true,
    }));

    return id;
  },

  sendMessage: async (text, role = "user") => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let chatId = get().selectedChatId;
    if (!chatId) {
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

    try {
      const chat = get().chats.find((c) => c.id === chatId);
      if (!chat) throw new Error("Chat no encontrado");

      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat.messages),
      });

      if (!response.ok) {
        throw new Error("Respuesta no OK del servidor");
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        chatId,
        role: "assistant",
        text: data.response,
        timestamp: Date.now(),
      };

      // 3️⃣ reemplazar mensaje temporal (éxito)
      set((state) => replaceTempMessage(state, chatId, assistantMsg));
    } catch (error) {
      console.error("Error enviando mensaje:", error);

      const errorMsg: Message = {
        id: crypto.randomUUID(),
        chatId,
        role: "assistant",
        text: "Error al obtener respuesta",
        timestamp: Date.now(),
      };

      // 3️⃣ reemplazar mensaje temporal (error)
      set((state) => replaceTempMessage(state, chatId, errorMsg));
    } finally {
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

      const messages =
        chats.find((c) => c.id === selectedChatId)?.messages ?? [];

      return {
        chats,
        selectedChatId,
        messagesList: messages,
        noMessages: messages.length === 0,
      };
    }),

  editChat: (chatId, newTitle) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, title: newTitle } : c
      ),
    })),
}));

// 🔧 helper para no duplicar lógica
function replaceTempMessage(
  state: ChatState,
  chatId: string,
  newMsg: Message
) {
  return {
    chats: state.chats.map((c) => {
      if (c.id !== chatId) return c;
      const msgs = [...c.messages];
      if (msgs.length && msgs[msgs.length - 1].id === "assistant-thinking") {
        msgs[msgs.length - 1] = newMsg;
      } else {
        msgs.push(newMsg);
      }
      return { ...c, messages: msgs };
    }),
    messagesList:
      state.selectedChatId === chatId
        ? (() => {
            const msgs = [...state.messagesList];
            if (msgs.length && msgs[msgs.length - 1].id === "assistant-thinking") {
              msgs[msgs.length - 1] = newMsg;
            } else {
              msgs.push(newMsg);
            }
            return msgs;
          })()
        : state.messagesList,
  };
}
