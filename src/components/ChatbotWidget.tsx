import {
  Bot,
  SendHorizontal,
  X,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { useChatContext } from "@/contexts/ChatContext";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotWidget = () => {
  const { activeChat, openChat, closeChat } = useChatContext();
  const isOpen = activeChat === "ai";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Xin chào! Tôi là chatbot hỗ trợ của TeeShop. Bạn có thể hỏi tôi về chính sách đổi trả, vận chuyển, thanh toán và nhiều vấn đề khác.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages]);

  // Mutation để gửi tin nhắn đến AI
  const sendMessageMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiClient.api.chatbotControllerAsk({ question });
      return response.data;
    },
    onSuccess: (data, question) => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.answer,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content:
          "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    sendMessageMutation.mutate(message.trim());
    setMessage("");
  };

  return (
    <div
      className={cn("fixed right-6 z-50", isOpen ? "bottom-6" : "bottom-24")}
    >
      {/* Chatbot Button */}
      {!isOpen && activeChat !== "admin" && (
        <motion.button
          key="chatbot-button"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openChat("ai")}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex justify-center items-center text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <Bot className="w-7 h-7" />
        </motion.button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <motion.div
          key="chatbot-window"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[330px] h-[500px] md:w-[380px] md:h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Chatbot</h3>
                <p className="text-white/80 text-[11px]">Trợ lý thông minh</p>
              </div>
            </div>
            <button
              onClick={() => closeChat()}
              className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 px-4 py-4 overflow-y-auto bg-slate-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex gap-2",
                    msg.isBot ? "justify-start" : "justify-end"
                  )}
                >
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-xl px-4 py-2.5 break-words",
                      msg.isBot
                        ? "bg-white border border-slate-200 text-slate-900 rounded-bl-md shadow-sm"
                        : "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        msg.isBot ? "text-slate-400" : "text-white/70"
                      )}
                    >
                      {formatDistanceToNow(msg.timestamp, {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {sendMessageMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl rounded-bl-md shadow-sm px-4 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1 rounded-lg border-slate-300 focus-visible:ring-purple-600 px-3 h-9 text-sm"
                placeholder="Hỏi chatbot..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sendMessageMutation.isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                className="rounded-lg w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={!message.trim() || sendMessageMutation.isPending}
                onClick={handleSendMessage}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SendHorizontal className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatbotWidget;
