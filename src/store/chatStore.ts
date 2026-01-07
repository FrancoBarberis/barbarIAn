//TODO: si el chat que borro es el selected chat id, thinking:false


import { create } from "zustand";
import type { Chat, Message, Role } from "../types/messageType";
import { useUIStore } from "./uiStore";

// =====================
// Config / Helpers
// =====================
const LS_KEYS = {
  chats: "chats",
  selectedChatId: "selectedChatId",
} as const;


const BACKEND_URL = import.meta.env.VITE_CHAT_API_URL ?? "http://localhost:3001/chat";
const BACKEND_STREAM_URL = import.meta.env.VITE_CHAT_STREAM_URL ?? "http://localhost:3001/chat/stream";


// Headers "como estaban": ajustá según tu backend (auth, custom headers, etc.)
function getBackendHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.OPENAI_API_KEY}`,
    // "X-Client": "barbarIAn-ui",
  };
}

function readChatsFromLS(): Chat[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.chats);
    return raw ? (JSON.parse(raw) as Chat[]) : [];
  } catch {
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

// =====================
// Estado inicial (hidratar)
// =====================
const initialChats: Chat[] = readChatsFromLS();
const initialSelectedId: string | null =
  readSelectedIdFromLS() ?? initialChats[0]?.id ?? null;
const initialMessages =
  initialSelectedId
    ? initialChats.find((c) => c.id === initialSelectedId)?.messages ?? []
    : [];

const setThinking = useUIStore.getState().setThinking;

// =====================
// Tipos
// =====================
type ChatState = {
  chats: Chat[];
  selectedChatId: string | null;
  messagesList: Message[];
  noMessages: boolean;

  selectChat: (chatId: string) => void;
  createChat: (title: string) => string | null;
  sendMessage: (text: string, role?: Role) => Promise<void>;
  getSelectedChat: () => Chat | null;
  deleteChat: (chatId: string) => void;
  editChat: (chatId: string, newTitle: string) => void;
};

// =====================
// Store
// =====================
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
        messagesList: newMessages,
        noMessages: newMessages.length === 0,
      };
    }),

  createChat: (title) => {

    //TODO: SOLO CREAR UN CHAT SI LA LISTA DE MENSAJES ACTUAL NO ESTA VACIA

    const allowCreate =
      get().chats.length === 0 || get().messagesList.length >= 0; 

    if (!allowCreate) {
      return null;
    }


    const id =
      crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
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


  // Envia y/o recibe mensajes. Si role = "user", llama al backend y streamea la respuesta.
  sendMessage: async (text, role = "user") => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 1) Asegurar chatId
    let chatId = get().selectedChatId;
    if (!chatId) {
      chatId = get().createChat(
        trimmed.length > 20 ? trimmed.slice(0, 20) + "..." : trimmed
      );
    }

    // 2) Mensaje entrante (usuario o asistente directo)
    const inboundMsg: Message = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      chatId,
      role,
      text: trimmed,
      timestamp: Date.now(),
    };

    // 3) Agregar el mensaje entrante y persistir
    set((state) => {
      const updatedChats = state.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, inboundMsg] } : c
      );

      saveChatsToLS(updatedChats);

      const isSelected = state.selectedChatId === chatId;
      const updatedMessagesList = isSelected
        ? [...state.messagesList, inboundMsg]
        : state.messagesList;

      return {
        chats: updatedChats,
        messagesList: updatedMessagesList,
        noMessages: updatedMessagesList.length === 0,
      };
    });

    // 4) Si no es user, no llamamos al backend (inyectás mensajes del asistente manualmente)
    if (role !== "user") return;

    // 5) Insertar placeholder del asistente y persistir
    const placeholder: Message = {
      id: "assistant-thinking", // ID conocido para reemplazo
      chatId,
      role: "assistant",
      text: "...",
      timestamp: Date.now(),
    };

    set((state) => {
      const updatedChats = state.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, placeholder] } : c
      );

      saveChatsToLS(updatedChats);

      const isSelected = state.selectedChatId === chatId;
      const updatedMessagesList = isSelected
        ? [...state.messagesList, placeholder]
        : state.messagesList;

      return {
        chats: updatedChats,
        messagesList: updatedMessagesList,
        noMessages: updatedMessagesList.length === 0,
      };
    });

    // 6) UI "thinking"
    setThinking(true);

    try {
      // 7) Payload para backend (historial completo del chat)
      const { chats } = get();
      const currentChat = chats.find((c) => c.id === chatId)!;

      const payload = {
        chatId,
        messages: currentChat.messages.map((m) => ({
          role: m.role,        // "user" | "assistant" | "system"
          content: m.text,     // tu backend usa "content"
          timestamp: m.timestamp,
          id: m.id,
        })),
      };

      // 8) Llamar endpoint de streaming
      const resp = await fetch(BACKEND_STREAM_URL, {
        method: "POST",
        headers: getBackendHeaders(),
        body: JSON.stringify({ messages: payload.messages }), // tu router espera { messages }
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`HTTP ${resp.status} ${resp.statusText} ${errText}`);
      }
      if (!resp.body) {
        throw new Error("La respuesta no incluye body (stream).");
      }

      // 9) Antes de leer stream: reemplazar placeholder por un mensaje real vacío
      const assistantMsgId =
        crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

      set((state) => {
        const updatedChats = state.chats.map((c) => {
          if (c.id !== chatId) return c;
          const hasPlaceholder = c.messages.some((m) => m.id === "assistant-thinking");
          const messages = hasPlaceholder
            ? c.messages.map((m) =>
              m.id === "assistant-thinking"
                ? { ...m, id: assistantMsgId, text: "", timestamp: Date.now() }
                : m
            )
            : [...c.messages, { id: assistantMsgId, chatId, role: "assistant", text: "", timestamp: Date.now() }];
          return { ...c, messages };
        });

        saveChatsToLS(updatedChats);

        const isSelected = state.selectedChatId === chatId;
        const updatedMessagesList = isSelected
          ? (state.messagesList.some((m) => m.id === "assistant-thinking")
            ? state.messagesList.map((m) =>
              m.id === "assistant-thinking"
                ? { ...m, id: assistantMsgId, text: "", timestamp: Date.now() }
                : m
            )
            : [...state.messagesList, { id: assistantMsgId, chatId, role: "assistant", text: "", timestamp: Date.now() }])
          : state.messagesList;

        return {
          chats: updatedChats,
          messagesList: updatedMessagesList,
          noMessages: updatedMessagesList.length === 0,
        };
      });

      // 10) Leer stream y actualizar texto acumulativamente
      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE: parsear líneas "data: {...}" y CRLF
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice("data:".length).trim();
          if (!jsonStr) continue;

          let evt: any;
          try {
            evt = JSON.parse(jsonStr);
          } catch {
            continue; // keep-alive u otros no JSON
          }

          if (evt.done) {
            // fin del stream enviado por el backend
            buffer = ""; // limpiar cualquier residuo
            break;
          }
          if (evt.error) {
            throw new Error(evt.message ?? "stream_failed");
          }

          const delta: string = evt.delta ?? "";
          if (delta) {
            acc += delta;

            // Actualizar el texto del mensaje del asistente y persistir
            set((state) => {
              const updatedChats = state.chats.map((c) => {
                if (c.id !== chatId) return c;
                const msgs = c.messages.map((m) =>
                  m.id === assistantMsgId ? { ...m, text: acc } : m
                );
                return { ...c, messages: msgs };
              });

              saveChatsToLS(updatedChats);

              const isSelected = state.selectedChatId === chatId;
              const updatedMessagesList = isSelected
                ? state.messagesList.map((m) =>
                  m.id === assistantMsgId ? { ...m, text: acc } : m
                )
                : state.messagesList;

              return {
                chats: updatedChats,
                messagesList: updatedMessagesList,
                noMessages: updatedMessagesList.length === 0,
              };
            });
          }
        }
      }
    } catch (err) {
      // 11) Error: quitar placeholder y agregar mensaje de error del asistente
      const errorMsg: Message = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        chatId,
        role: "assistant",
        text:
          "Hubo un problema al obtener la respuesta del agente. " +
          (err instanceof Error ? err.message : "Error desconocido."),
        timestamp: Date.now(),
      };

      set((state) => {
        const updatedChats = state.chats.map((c) => {
          if (c.id !== chatId) return c;
          const filtered = c.messages.filter((m) => m.id !== "assistant-thinking");
          return { ...c, messages: [...filtered, errorMsg] };
        });

        saveChatsToLS(updatedChats);

        const isSelected = state.selectedChatId === chatId;
        const updatedMessagesList = isSelected
          ? [
            ...state.messagesList.filter((m) => m.id !== "assistant-thinking"),
            errorMsg,
          ]
          : state.messagesList;

        return {
          chats: updatedChats,
          messagesList: updatedMessagesList,
          noMessages: updatedMessagesList.length === 0,
        };
      });
    } finally {
      // 12) Apagar "pensando" siempre
      setThinking(false);
    }
  },


  getSelectedChat: () => {
    const { chats, selectedChatId } = get();
    return chats.find((c) => c.id === selectedChatId) ?? null;
  },

  deleteChat: (chatId) =>
    set((state) => {
      const updatedChats = state.chats.filter((c) => c.id !== chatId);

      const newSelectedId =
        state.selectedChatId === chatId
          ? updatedChats[0]?.id ?? null
          : state.selectedChatId;

      const newMessages =
        newSelectedId
          ? updatedChats.find((c) => c.id === newSelectedId)?.messages ?? []
          : [];

      saveChatsToLS(updatedChats);
      saveSelectedIdToLS(newSelectedId);

      return {
        chats: updatedChats,
        selectedChatId: newSelectedId,
        messagesList: newMessages,
        noMessages: newMessages.length === 0,
      };
    }),

  editChat: (chatId, newTitle) =>
    set((state) => {
      const updatedChats = state.chats.map((c) =>
        c.id === chatId ? { ...c, title: newTitle } : c
      );

      saveChatsToLS(updatedChats);

      return { chats: updatedChats };
    }),
}));
