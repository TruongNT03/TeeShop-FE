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
    <div className="fixed bottom-8 right-8 z-[11] bg-transparent">
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary flex justify-center items-center text-white drop-shadow-2xl hover:bg-primary/80 cursor-pointer transition-transform active:scale-95 hover:scale-110"
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
            className="w-[700px] h-[500px] bg-white rounded-md shadow-2xl shadow-black/70 overflow-hidden flex flex-col"
          >
            <div className="w-full flex justify-between items-center p-2 bg-primary">
              <div className="flex items-end text-white gap-2">
                <MessageSquareText />
              </div>
              <X
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-[2] border-r-[1px] border-black flex flex-col">
                <div className="p-2 flex-1 gap-2 overflow-y-auto flex flex-col">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex gap-3 py-2 hover:bg-primary/40 cursor-pointer rounded-md px-2 ${
                        conversationId === conversation.id
                          ? "bg-primary/40"
                          : ""
                      }`}
                      onClick={() => setConversationId(conversation.id)}
                    >
                      <img
                        onError={(e) =>
                          (e.currentTarget.src = "default-user-avatar.jpg")
                        }
                        src={conversation?.user?.avatar}
                        className="w-[40px] h-[40px] rounded-md"
                      />
                      <div className="flex flex-col">
                        <div className="text-[14px] font-semibold truncate">
                          {conversation?.user?.name}
                        </div>
                        <div className="truncate max-w-[200px] text-[12px]">
                          {conversation?.latestMessage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-[3] flex flex-col h-full">
                <div className="p-3 flex-1 gap-2 overflow-y-auto flex flex-col-reverse">
                  {chatMessages.map((msg) =>
                    msg.senderId !==
                    conversations.filter(
                      (conversation) => conversation.id === conversationId
                    )[0]?.user?.id ? (
                      <div
                        key={msg.id}
                        className="text-sm bg-primary rounded-md p-2 text-white ml-auto max-w-[80%] mb-2"
                      >
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        key={msg.id}
                        className="text-sm border-primary border-[1px] rounded-md p-2 mr-auto max-w-[80%] mb-2"
                      >
                        {msg.content}
                      </div>
                    )
                  )}
                </div>

                <div className="px-3 py-2 border-t flex gap-2 items-center">
                  <Input
                    type="text"
                    className="outline-0 border-[1px] flex-1"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessageMutation({
                          content: message,
                          conversationId,
                        });
                        setMessage("");
                      }
                    }}
                    disabled={!conversationId || isSendMessagePending}
                  />
                  <Button
                    className="transition-transform active:scale-95"
                    disabled={
                      !message || !conversationId || isSendMessagePending
                    }
                    onClick={() => {
                      sendMessageMutation({
                        content: message,
                        conversationId,
                      });
                      setMessage("");
                    }}
                  >
                    {isSendMessagePending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <SendHorizontal />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminChatWidget;
