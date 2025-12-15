
import styles from "./ChatSidebar.module.css";
import UserProfile from "../UserProfile/UserProfile";
import { useChatStore } from "../../store/chatStore";
import { useUIStore } from "../../store/uiStore";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";



//TODO: Agregar funcionalidad de eliminar chat
const ChatSidebar: React.FC = () => {
  const collapsed = useUIStore((s) => s.collapsed)
  const changeCollapsed = useUIStore((s) => s.changeCollapsed);
  const chats = useChatStore((s) => s.chats);
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const selectChat = useChatStore((s) => s.selectChat);
  const createChat = useChatStore((s) => s.createChat);

  const deleteChat = useChatStore((s) => s.deleteChat);

  return (
    
    <aside className={clsx(styles.chatSidebar, collapsed && styles.collapsed)} onMouseEnter={changeCollapsed} onMouseLeave={changeCollapsed}>
      <button className={clsx(styles.newChat, collapsed && styles.hidden)} onClick={() => createChat("Nuevo chat")}>+</button>

      <div
        className={clsx(
          styles.chatList,
          collapsed && styles.hidden,
          chats.length === 0 && styles.centered
        )}
      >

        {/* Lista de chats */}
        {chats.map((chat) => {
          const isActive = chat.id === selectedChatId;
          return (
            <div
              key={chat.id}
              role="button"
              tabIndex={0}
              className={clsx(styles.chat, isActive && styles.active)}
              onClick={() => selectChat(chat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") selectChat(chat.id);
              }}
            >
              <div className={styles.messageTitle}>{chat.title}</div>
              <div ><button className={clsx(styles.chatControl)} onClick={() => console.log("E")}>E</button></div>
              <div><button className={clsx(styles.chatControl)} onClick={() => deleteChat(chat.id)}>D</button></div>
            </div>

          );
        })}

        {/* Si la lista está vacía, un placeholder breve */}
        {chats.length === 0 && (
          <p className={styles.message}>No hay chats. Creá uno para empezar.</p>
        )}
      </div>
      <UserProfile />
    </aside>
  );
};

export default ChatSidebar;
