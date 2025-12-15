// Home.tsx
import React from "react";
import styles from "./Home.module.css";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import InputBox from "../../components/InputBox/InputBox";
import { useChatStore } from "../../store/chatStore";
import AgentPreview from "../../components/AgentPreview/AgentPreview";

const Home: React.FC = () => {
  // Selectores del store (Zustand)
  const chats = useChatStore((s) => s.chats);
  const selectedChatId = useChatStore((s) => s.selectedChatId);

  // Derivar la lista de mensajes del chat seleccionado (como antes)
  const messagesList =
    chats.find((c) => c.id === selectedChatId)?.messages ?? [];

  

  return (
    <div className={styles.container}>
      <ChatSidebar />
      <div className={styles.chatArea}>
        {/* Mantener props si tu UI depende de eso */}
        <ChatWindow messagesList={messagesList} />
        <InputBox />
      </div>
      <AgentPreview />
    </div>
  );
};

export default Home;
