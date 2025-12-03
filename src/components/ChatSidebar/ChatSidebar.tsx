import styles from "./ChatSidebar.module.css";
import UserProfile from "../UserProfile/UserProfile";

const ChatSidebar: React.FC = () => {
  return (
    <div className={styles.chatSidebar}>
      <button className={styles.toggleSidebar}>X</button>
      <h2>Chat Sidebar</h2>
      <UserProfile />
    </div>
  );
};

export default ChatSidebar;
