
import styles from "./ChatWindow.module.css";
import Message from "../Message/Message";
import type { Message as MessageType } from "../../types/messageType";
import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import clsx from "clsx";

interface ChatWindowProps {
  messagesList: MessageType[];
}

export default function ChatWindow({ messagesList }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const chatTitle = useChatStore((state) => {
    const selectedChat = state.getSelectedChat();
    return selectedChat ? selectedChat.title : "Chat";
  });

  useEffect(() => {
    // Esperar al siguiente frame para asegurar que el DOM ya se renderizó
    const id = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(id);
  }, [messagesList.length]); // cada vez que se agrega/quita un mensaje

  return (
    <div className={clsx(styles.chatWindow, messagesList.length === 0 && styles.no__messages)}>
      <h2 className={styles.chatTitle}>{messagesList.length === 0 ? "" : chatTitle}</h2>
      {messagesList.map((msg, idx) => (
        <Message
          key={msg.id ?? `${msg.role}-${msg.timestamp ?? Math.random()}`}
          text={msg.text}
          role={msg.role}
          timestamp={msg.timestamp}
          isLast={idx === messagesList.length - 1}
        />
      ))}

      {/* Sentinela al final: ¡este es el elemento que se scrollIntoView! */}
      <div ref={endRef} />
    </div>
  );
}
