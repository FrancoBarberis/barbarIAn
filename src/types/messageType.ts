
export type Role = "user" | "assistant";

export type Message = {
  id: string;
  chatId: string;
  role: Role;
  text: string;
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};
