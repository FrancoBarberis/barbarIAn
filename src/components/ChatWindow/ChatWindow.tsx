
import styles from "./ChatWindow.module.css";
import Message from "../Message/Message";
import type { Message as MessageType } from "../../types/messageType";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  messagesList: MessageType[];
}

export default function ChatWindow({ messagesList }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Esperar al siguiente frame para asegurar que el DOM ya se renderizó
    const id = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(id);
  }, [messagesList.length]); // cada vez que se agrega/quita un mensaje

  return (
    <div className={styles.chatWindow}>
      {messagesList.map((msg) => (
        <Message
          key={msg.id ?? `${msg.role}-${msg.timestamp ?? Math.random()}`}
          text={msg.text}
          role={msg.role}
          timestamp={msg.timestamp}
        />
      ))}

      {/* Sentinela al final: ¡este es el elemento que se scrollIntoView! */}
      <div ref={endRef} />
    </div>
  );
}
