import { createContext, useContext, useState, type ReactNode } from "react";

type ChatType = "admin" | "ai" | null;

interface ChatContextType {
  activeChat: ChatType;
  openChat: (type: ChatType) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [activeChat, setActiveChat] = useState<ChatType>(null);

  const openChat = (type: ChatType) => {
    setActiveChat(type);
  };

  const closeChat = () => {
    setActiveChat(null);
  };

  return (
    <ChatContext.Provider value={{ activeChat, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};
