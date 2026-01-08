import { MessageSquareText, SendHorizontal, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAdminChatWidget } from "@/hooks/useAdminChatWidget";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAdminChatContext } from "@/contexts/AdminChatContext";

const AdminChatWidget = () => {
  const { isOpen, setIsOpen } = useAdminChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    isLoadingConversations,
    unreadConversations,
    selectedConversationId,
    setSelectedConversationId,
    messages,
    messageInput,
    setMessageInput,
    isSending,
    handleSendMessage,
  } = useAdminChatWidget();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get selected conversation details
  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          key="admin-chat-button"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex justify-center items-center text-white shadow-lg hover:shadow-xl transition-shadow relative"
        >
          {/* Unread indicator badge */}
          {unreadConversations.size > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {unreadConversations.size}
              </span>
            </div>
          )}
          <MessageSquareText className="w-7 h-7" />
        </motion.button>
      )}

      {/* Chat Window */}
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
              <h3 className="text-white font-semibold">Quản lý tin nhắn</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg hover:bg-white/20 p-1 flex items-center justify-center transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Conversations List */}
            <div className="w-[300px] border-r border-slate-200 bg-slate-50 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200 bg-white">
                <h4 className="font-semibold text-slate-900 text-sm">
                  Cuộc trò chuyện ({conversations.length})
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {isLoadingConversations ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-slate-500 text-center px-4">
                      Chưa có cuộc trò chuyện nào
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={cn(
                        "w-full flex gap-3 p-3 rounded-lg cursor-pointer transition-all mb-1 relative",
                        selectedConversationId === conversation.id
                          ? "bg-white shadow-sm border border-primary/20"
                          : "hover:bg-white hover:shadow-sm"
                      )}
                    >
                      {/* Unread badge */}
                      {unreadConversations.has(conversation.id) && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                      <img
                        src={conversation?.user?.avatar}
                        alt={conversation?.user?.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                            conversation?.user?.name;
                        }}
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
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - Messages */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {!selectedConversationId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquareText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                      Chọn cuộc trò chuyện để bắt đầu
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Container */}
                  <div className="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/50">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-slate-500">
                          Chưa có tin nhắn nào
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[...messages].reverse().map((msg) => {
                          const isAdmin =
                            msg.senderId !== selectedConversation?.user?.id;

                          return (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex",
                                isAdmin ? "justify-end" : "justify-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[75%] rounded-2xl px-4 py-3 break-words",
                                  isAdmin
                                    ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md shadow-md"
                                    : "bg-white border border-slate-200/80 text-slate-900 rounded-bl-md shadow-sm"
                                )}
                              >
                                <p className="text-[13px] leading-relaxed">
                                  {msg.content}
                                </p>
                                {msg.createdAt && (
                                  <p
                                    className={cn(
                                      "text-[10px] mt-1.5 font-medium",
                                      isAdmin
                                        ? "text-white/80"
                                        : "text-slate-400"
                                    )}
                                  >
                                    {formatDistanceToNow(
                                      new Date(msg.createdAt),
                                      {
                                        addSuffix: true,
                                        locale: vi,
                                      }
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Input Footer */}
                  <div className="p-4 border-t border-slate-200/80 bg-white shadow-sm">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        className="flex-1 rounded-lg border-slate-300 focus-visible:ring-primary focus-visible:ring-2 px-4 h-10 text-sm"
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                      />
                      <Button
                        size="icon"
                        className="rounded-lg w-10 h-10 flex-shrink-0 shadow-sm"
                        disabled={!messageInput.trim() || isSending}
                        onClick={handleSendMessage}
                      >
                        {isSending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <SendHorizontal className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminChatWidget;
