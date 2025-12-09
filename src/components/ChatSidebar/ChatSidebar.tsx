import styles from "./ChatSidebar.module.css";
import UserProfile from "../UserProfile/UserProfile";
import { useState } from "react";
import clsx from "clsx";

const ChatSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={clsx(
      styles.chatSidebar,
      { [styles.collapsed]: collapsed }
    )}
    >
      <button className={styles.toggleSidebar} onClick={() => setCollapsed(prev => !prev)}>{collapsed ? ">" : "X"}</button>
      <ul className={clsx(
        styles.messageList,
        { [styles.hidden]: collapsed }
      )}>
        <li className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</li>
        <li>Mensaje2dsadasdasdsadasdsdsadsadsadsadsds</li>
        <li>Mensaje1dsadsadsadsadsadsadsadsadsadsad</li>
        <li>Mensaje3sadsadasdasdasdsadasdasdasdas</li>
        <li>Mensaje4</li>
        <li>Mensaje5</li>
      </ul>
      <UserProfile />
    </div>
  );
};

export default ChatSidebar;
