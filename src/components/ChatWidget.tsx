import { MessageSquareText, SendHorizontal, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChatWidget } from "@/hooks/useChatWidget";
import { motion, AnimatePresence } from "motion/react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    chatMessages,
    sendMessage,
    message,
    setMessage,
    conversation,
    createConversation,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatWidget();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false); // ✅ flag để phân biệt đang load thêm tin nhắn cũ

  // ⚙️ Scroll xuống cuối cùng
  const scrollToBottom = () => {
    const div = messagesContainerRef.current;
    if (!div) return;
    requestAnimationFrame(() => {
      div.scrollTop = div.scrollHeight;
    });
  };

  // 🔄 Khi mở khung chat → scroll xuống dưới cùng
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 200);
    }
  }, [isOpen]);

  // 📩 Khi có tin nhắn mới → scroll xuống dưới, trừ khi đang load thêm page
  useEffect(() => {
    if (!isLoadingMoreRef.current) {
      scrollToBottom();
    }
  }, [chatMessages.length]);

  // 🧭 Khi cuộn lên top → fetch page mới
  const handleScrollTop = async (e: React.UIEvent<HTMLDivElement>) => {
    const div = e.currentTarget;

    if (div.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const prevScrollHeight = div.scrollHeight;
      isLoadingMoreRef.current = true; // 🔒 bật cờ trước khi fetch

      await fetchNextPage();

      requestAnimationFrame(() => {
        const newScrollHeight = div.scrollHeight;
        div.scrollTop = newScrollHeight - prevScrollHeight;
        isLoadingMoreRef.current = false; // 🔓 tắt cờ sau khi xử lý xong
      });
    }
  };

  // 📤 Gửi tin nhắn
  const handleSend = async () => {
    if (!message.trim() || !conversation?.id) return;
    try {
      await sendMessage({
        content: message,
        conversationId: conversation.id,
      });
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[11] bg-transparent">
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary flex justify-center items-center text-white drop-shadow-2xl hover:bg-primary/80 cursor-pointer transition-transform active:scale-95"
        >
          <MessageSquareText />
        </motion.div>
      ) : null}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            exit={{
              y: 20,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className="w-[300px] h-[400px] bg-white rounded-md shadow-2xl shadow-black/70 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center px-2 py-1 bg-primary">
              <div className="flex items-end text-white gap-2">
                <img src="admin-avatar.png" alt="" className="h-[28px]" />
                <div className="text-white font-medium">Chat with us</div>
              </div>
              <X
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Body */}
            <div
              className="flex-1 px-3 py-2 overflow-y-auto flex flex-col gap-2 relative"
              ref={messagesContainerRef}
              onScroll={handleScrollTop}
            >
              {/* Loading khi fetch page mới */}
              {isFetchingNextPage && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              )}

              {!conversation?.id && (
                <div className="flex justify-center mt-10">
                  <Button onClick={() => createConversation.mutate()}>
                    Start chat
                  </Button>
                </div>
              )}

              {[...chatMessages].reverse().map((msg) =>
                msg.senderId === conversation?.users?.[0]?.id ? (
                  <div
                    key={msg.id}
                    className="text-sm bg-primary rounded-md p-2 text-white ml-auto max-w-[80%]"
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className="text-sm border-primary border-[1px] rounded-md p-2 mr-auto max-w-[80%]"
                  >
                    {msg.content}
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t flex gap-2">
              <Input
                type="text"
                className="outline-0 border-[1px] p-1 flex-1"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!conversation?.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                className="transition-transform active:scale-95"
                type="submit"
                disabled={!message || !conversation?.id}
                onClick={handleSend}
              >
                <SendHorizontal />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
