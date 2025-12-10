import styles from "./ChatSidebar.module.css";
import UserProfile from "../UserProfile/UserProfile";
import { useState } from "react";
import clsx from "clsx";

const ChatSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false); //TODO: PASAR A ESTADO GLOBAL PARA MANEJAR ANCHO DE USER PROFILE
  return (
    <aside
      className={clsx(styles.chatSidebar, { [styles.collapsed]: collapsed })}
    >
      <button
        className={styles.toggleSidebar}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? ">" : "X"}
      </button>
      <div className={clsx(styles.messageList, { [styles.hidden]: collapsed })}>
        <p className={styles.message}>PRIMERO</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>Mensaje1sadasdasdasdsadsadasdasdasd</p>
        <p className={styles.message}>ULTIMO</p>
        
      </div>
      <UserProfile />
    </aside>
  );
};

export default ChatSidebar;
