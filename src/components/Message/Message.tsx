import styles from "./Message.module.css";

interface MessageProps {
    text: string;
    role: "user" | "assistant";
}

const Message:React.FC <MessageProps> = () => {
    return (
        <div className={styles.message}>
            Hello, this is a message component!
        </div>
    );
}

export default Message;