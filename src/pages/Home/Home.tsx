import React from "react";
import styles from "./Home.module.css";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import InputBox from "../../components/InputBox/InputBox";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <ChatSidebar />
      <div className={styles.chatArea}>
        <ChatWindow />
        <InputBox />
      </div>
    </div>
  );
};

export default Home;
