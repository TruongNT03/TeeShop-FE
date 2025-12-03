import {
  MessageSquareText,
  SendHorizontal,
  X,
  Loader2,
  LoaderCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAdminChatWidget } from "@/hooks/useAdminChatWidget";
import { AnimatePresence, motion } from "motion/react";
import useImageExists from "@/hooks/useImageExists";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

const AdminChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    conversations,
    isError,
    isLoading,
    conversationId,
    setConversationId,
    chatMessages,
    message,
    setMessage,
    isSendMessagePending,
    sendMessageMutation,
  } = useAdminChatWidget();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <motion.button
          key="admin-chat-button"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex justify-center items-center text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageSquareText className="w-7 h-7" />
        </motion.button>
      )}

      {isOpen && (
        <motion.div
          key="admin-chat-window"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[800px] h-[600px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary to-primary/95 px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <MessageSquareText className="text-white" />
              <h3 className="text-white">Quản lý tin nhắn</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg hover:bg-white/20 flex items-center justify-center transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div className="w-[280px] border-r border-slate-200 bg-slate-50 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200 bg-white">
                <h4 className="font-semibold text-slate-900 text-sm">
                  Cuộc hội thoại
                </h4>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full flex gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-all mb-1 ${
                      conversationId === conversation.id
                        ? "bg-white shadow-sm border border-primary/20"
                        : "hover:shadow-sm"
                    }`}
                    onClick={() => setConversationId(conversation.id)}
                  >
                    <img
                      onError={(e) =>
                        (e.currentTarget.src = "default-user-avatar.jpg")
                      }
                      src={conversation?.user?.avatar}
                      alt={conversation?.user?.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border-2 border-white shadow-sm"
                    />
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate w-full text-left">
                        {conversation?.user?.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate w-full text-left">
                        {conversation?.latestMessage || "Chưa có tin nhắn"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Messages Area */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Messages Container */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col-reverse bg-gradient-to-b from-slate-50 to-slate-100/50">
                {!conversationId ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquareText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">
                        Chọn cuộc hội thoại để bắt đầu
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...chatMessages].reverse().map((msg) => {
                      const isAdmin =
                        msg.senderId !==
                        conversations.find((c) => c.id === conversationId)?.user
                          ?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 break-words ${
                              isAdmin
                                ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md shadow-md"
                                : "bg-white border border-slate-200/80 text-slate-900 rounded-bl-md shadow-sm"
                            }`}
                          >
                            <p className="text-[13px] leading-relaxed">
                              {msg.content}
                            </p>
                            {msg.createdAt && (
                              <p
                                className={cn(
                                  "text-[10px] mt-1.5 font-medium",
                                  isAdmin ? "text-white/80" : "text-slate-400"
                                )}
                              >
                                {formatDistanceToNow(new Date(msg.createdAt), {
                                  addSuffix: true,
                                  locale: vi,
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className="p-2 border-t border-slate-200/80 bg-white shadow-sm">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    className="flex-1 rounded-md border-slate-300 focus-visible:ring-primary focus-visible:ring-2 px-4 h-10 text-sm"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (message.trim() && conversationId) {
                          sendMessageMutation({
                            content: message.trim(),
                            conversationId,
                          });
                          setMessage("");
                        }
                      }
                    }}
                    disabled={!conversationId || isSendMessagePending}
                  />
                  <Button
                    size="icon"
                    className="rounded-md w-10 h-10 flex-shrink-0 shadow-sm"
                    disabled={
                      !message.trim() || !conversationId || isSendMessagePending
                    }
                    onClick={() => {
                      if (message.trim() && conversationId) {
                        sendMessageMutation({
                          content: message.trim(),
                          conversationId,
                        });
                        setMessage("");
                      }
                    }}
                  >
                    {isSendMessagePending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <SendHorizontal className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminChatWidget;
