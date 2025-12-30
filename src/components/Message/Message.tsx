import styles from "./Message.module.css";
import clsx from "clsx";
import Card from "@mui/joy/Card";

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
    <Card
      orientation="horizontal"
      size="lg"
      variant="soft"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 20px",
        minWidth: "20%",
        backgroundColor: role === "assistant" ? "gray" : "green",
        color: "black",
        alignSelf: role === "assistant" ? "flex-end" : "flex-start",
        marginRight: role === "assistant" ? "2%" : "0",
        marginLeft: role === "user" ? "2%" : "0",
      }}
      className={clsx(styles.message)}
    >
      <p className={styles.message_text}>{text}</p>
      <span style={{alignSelf: role === "assistant" ? "flex-end" : "flex-start"}}>{formattedTime}</span>
    </Card>
  );
};

export default Message;
