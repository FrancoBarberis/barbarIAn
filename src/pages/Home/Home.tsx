import React from "react";
import styles from "./Home.module.css";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import InputBox from "../../components/InputBox/InputBox";
import { useState } from "react";
import type { Message as MessageType } from "../../types/messageType";

const Home: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]); //DEBE SER GLOBAL
  const onSendMessage = (message: MessageType) => {
    console.log(message);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message.text, role: message.role },
    ]);
  };
  return (
    <div className={styles.container}>
      {/* TODO: Render del chat log en sidebar */}
      <ChatSidebar /> 
      <div className={styles.chatArea}>
        <ChatWindow messagesList={messages} />
        <InputBox onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default Home;
