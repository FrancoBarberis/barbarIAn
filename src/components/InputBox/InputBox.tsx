import { useEffect, useRef, useState } from "react";
import styles from "./InputBox.module.css";
import { useChatStore } from "../../store/chatStore";
import SendIcon from "../../assets/send.png";
import clsx from "clsx";

const InputBox: React.FC = () => {

  const messagesList = useChatStore((s) => s.messagesList)
  const noMessages = useChatStore((s)=> s.noMessages)


  const [message, setMessage] = useState("");
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const waitingForResponse = false; // Placeholder for future use

  // Cuando cambia el chat seleccionado, enfocar el input
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChatId]);

  const submit = () => {
    sendMessage(message, "user");
    setMessage("");
  };

  return (
    //TODO: Revisar que el texto no se ponga detras del boton cuando es un parrafo muy largo
    <form
      className={clsx(styles.inputBox, noMessages && styles.no__messages)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        name="message_input"
        placeholder="Type your message..."
        className={styles.inputField}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        autoComplete="off"
      />
      <button
        className={styles.sendButton}
        type="submit"
        disabled={!message.trim()}
      >
        <img src={SendIcon} alt="send icon" loading="eager" className={styles.imgSendIcon} />
      </button>
    </form>
  );
};

export default InputBox;
