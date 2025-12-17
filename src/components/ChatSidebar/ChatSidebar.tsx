
import styles from "./ChatSidebar.module.css";
import UserProfile from "../UserProfile/UserProfile";
import { useChatStore } from "../../store/chatStore";
import { useUIStore } from "../../store/uiStore";
import clsx from "clsx";

const ChatSidebar: React.FC = () => {
  const collapsed = useUIStore((s) => s.collapsed);
  const setCollapsed = useUIStore((s) => s.setCollapsed);

  const chats = useChatStore((s) => s.chats);
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const selectChat = useChatStore((s) => s.selectChat);
  const createChat = useChatStore((s) => s.createChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const editChat = useChatStore((s) => s.editChat);

  return (
    <aside
      className={clsx(styles.chatSidebar, collapsed && styles.collapsed)}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {collapsed ? (
        // Vista colapsada
        <div className={styles.collapsedContent}>
          {">"}
        </div>
      ) : (
        // Vista expandida
        <>
          <button
            className={styles.newChat}
            onClick={() => createChat("Nuevo chat")}
          >
            +
          </button>

          <div
            className={clsx(
              styles.chatList,
              chats.length === 0 && styles.centered
            )}
          >
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

                  {/* Importante: evitar que los botones internos disparen el onClick del contenedor */}
                  <div>
                    <button
                      className={styles.chatControl}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = prompt("Nuevo título:", chat.title) || chat.title;
                        editChat(chat.id, newTitle);
                      }}
                      aria-label="Editar título"
                    >
                      E
                    </button>
                  </div>
                  <div>
                    <button
                      className={styles.chatControl}
                      onClick={(e) => {
                        e.stopPropagation(); // evita seleccionar el chat o afectar hover
                        deleteChat(chat.id);
                      }}
                      aria-label="Eliminar chat"
                    >
                      D
                    </button>
                  </div>
                </div>
              );
            })}

            {chats.length === 0 && (
              <p className={styles.message}>
                No hay chats. Creá uno para empezar.
              </p>
            )}
          </div>

          <UserProfile />
        </>
      )}
    </aside>
  );
};

export default ChatSidebar;
