import {
  MessageSquareText,
  SendHorizontal,
  X,
  Loader2,
  User,
  Bot,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChatWidget } from "@/hooks/useChatWidget";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const ChatWidget = () => {
  const { activeChat, openChat, closeChat } = useChatContext();
  const isOpen = activeChat === "admin";

  const {
    chatMessages,
    message,
    setMessage,
    conversation,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSendMessagePending,
    sendMessageMute,
    messagesContainerRef,
    conversationId,
    createConversationMutate,
    isCreateConversationPending,
    isSendingMessage,
    setIsSendingMessage,
  } = useChatWidget();

  const isLoadingMoreRef = useRef(false);

  const scrollToBottom = () => {
    const div = messagesContainerRef.current;
    if (!div) return;
    requestAnimationFrame(() => {
      div.scrollTop = div.scrollHeight;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isLoadingMoreRef.current) {
      scrollToBottom();
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!message.trim() || !conversationId || isSendMessagePending) return;

    sendMessageMute({
      content: message.trim(),
      conversationId,
    });

    setMessage("");
  };

  const handleScrollTop = async (e: React.UIEvent<HTMLDivElement>) => {
    const div = e.currentTarget;

    if (div.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const prevScrollHeight = div.scrollHeight;
      isLoadingMoreRef.current = true;

      await fetchNextPage();

      requestAnimationFrame(() => {
        const newScrollHeight = div.scrollHeight;
        div.scrollTop = newScrollHeight - prevScrollHeight;
        isLoadingMoreRef.current = false;
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && activeChat !== "ai" && (
        <motion.button
          key="chat-button"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openChat("admin")}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex justify-center items-center text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <MessageSquareText className="w-7 h-7" />
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          key="chat-window"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[330px] h-[500px] md:w-[380px] md:h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 px-5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Hỗ trợ khách hàng
                </h3>
                <p className="text-white/80 text-[11px]">
                  Luôn sẵn sàng hỗ trợ bạn
                </p>
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
          <div
            className="flex-1 px-4 py-4 overflow-y-auto bg-slate-50 relative"
            ref={messagesContainerRef}
            onScroll={handleScrollTop}
          >
            {/* Loading indicator at top */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}

            {/* Empty state - Start conversation */}
            {!conversation?.id && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquareText className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Chào mừng bạn!
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Bắt đầu trò chuyện để được hỗ trợ
                  </p>
                  <Button
                    onClick={() => createConversationMutate()}
                    disabled={isCreateConversationPending}
                    className="gap-2"
                  >
                    {isCreateConversationPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Bắt đầu trò chuyện
                  </Button>
                </div>
              </div>
            )}

            {/* Messages */}
            {conversation?.id && (
              <div className="space-y-4">
                {[...chatMessages].reverse().map((msg, index) => {
                  const isUser = msg.senderId === conversation?.users?.[0]?.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2",
                        isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-xl px-4 py-2.5 break-words",
                          isUser
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-white border border-slate-200 text-slate-900 rounded-bl-md shadow-sm"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        {msg.createdAt && (
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isUser ? "text-white/70" : "text-slate-400"
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
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1 rounded-lg border-slate-300 focus-visible:ring-primary px-3 h-9 text-sm"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!conversation?.id || isSendMessagePending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                className="rounded-lg w-9 h-9 flex-shrink-0"
                disabled={
                  !message.trim() || !conversation?.id || isSendMessagePending
                }
                onClick={handleSendMessage}
              >
                {isSendMessagePending ? (
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

export default ChatWidget;
