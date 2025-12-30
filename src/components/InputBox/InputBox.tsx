import { useEffect, useRef, useState } from "react";
import styles from "./InputBox.module.css";
import { useChatStore } from "../../store/chatStore";
import { useUIStore } from "../../store/uiStore";
import SendIcon from "../../assets/send.png";
import StopIcon from "../../assets/stop-icon.png";
import clsx from "clsx";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";

const InputBox: React.FC = () => {
  const thinking = useUIStore((s) => s.thinking);
  const noMessages = useChatStore((s) => s.noMessages);
  const [message, setMessage] = useState("");
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChatId]);

  const submit = () => {
    sendMessage(message, "user");
    setMessage("");
  };

  return (
    <form
      className={clsx(styles.inputBox, noMessages && styles.no__messages)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid #ccc",
          width: "90%",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <Input
          color="primary"
          size="md"
          variant="soft"
          ref={inputRef}
          type="text"
          name="message_input"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          autoComplete="off"
          sx={{
            flexGrow: 1,
            borderRadius: "24px 0 0 24px",
            padding: "0 16px",
          }}
        />
        <Button
          type="submit"
          disabled={!message.trim()}
          sx={{
            borderRadius: "0 24px 24px 0",
            minWidth: "auto",
            padding: "0 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
          }}
        >
          <img
            src={thinking ? StopIcon : SendIcon}
            alt="send icon"
            loading="eager"
            className={styles.imgSendIcon}
          />
        </Button>
      </Box>
    </form>
  );
};

export default InputBox;
``
