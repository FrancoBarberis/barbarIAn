
import styles from "./Message.module.css";
import clsx from "clsx";

interface MessageProps {
  text: string;
  role: "user" | "assistant";
  timestamp: number;
}

const Message: React.FC<MessageProps> = ({ text, role, timestamp }) => {

const formattedTime = new Date(timestamp).toLocaleTimeString("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
  return (
    <div
      className={clsx(
        styles.message,                // estilos comunes (burbuja, padding, etc.)
        role === "assistant" && styles.assistant,
        role === "user" && styles.user
      )}
    >
      <h3 className={styles.message_text}>{text}</h3>
      <p className={styles.timestamp}>{formattedTime}</p>
    </div>
  );
};

export default Message;
