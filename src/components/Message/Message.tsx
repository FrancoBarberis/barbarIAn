import styles from "./Message.module.css";
import clsx from "clsx";
import Card from "@mui/joy/Card";
import { motion } from "framer-motion";
import CircularProgress from "@mui/joy/CircularProgress";

interface MessageProps {
  text: string;
  role: "user" | "assistant";
  timestamp: number;
}

const MessageCard = motion(Card);

const Message: React.FC<MessageProps> = ({ text, role, timestamp }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return text === "..." ? (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 1.3, ease: "easeOut" }}
      style={{
        alignSelf: "flex-end",
        paddingRight: "10%",
        marginTop: "4px",
        marginBottom: "4px",
      }}
    >
      <CircularProgress size="md" color="neutral" />
    </motion.div>
  ) : (
    <MessageCard
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      variant="soft"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",

        /* 🔑 claves para que no se rompa */
        width: "fit-content",
        maxWidth: "50%",
        padding: "10px 16px",
        backgroundColor: role === "assistant" ? "gray" : "green",
        color: "black",
        alignSelf: role === "assistant" ? "flex-end" : "flex-start",
        marginRight: role === "assistant" ? "2%" : "0",
        marginLeft: role === "user" ? "2%" : "0",
      }}
      className={clsx(styles.message)}
    >
      <p className={styles.message_text}>{text}</p>
      <span
        style={{
          alignSelf: role === "assistant" ? "flex-end" : "flex-start",
          fontSize: "0.75em",
          opacity: 0.7,
          color: "white",
        }}
      >
        {formattedTime}
      </span>
    </MessageCard>
  );
};

export default Message;
