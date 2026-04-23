"use client";

import { useState, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
}

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
}

export default function MessagingPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      markChatAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      const response = await fetch("/api/messages/chats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/messages/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const markChatAsRead = async (chatId: string) => {
    try {
      await fetch(`/api/messages/chats/${chatId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || (!newMessage.trim() && !file)) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("chatId", selectedChat.id);
      formData.append("content", newMessage);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (response.ok) {
        setNewMessage("");
        setFile(null);
        await loadMessages(selectedChat.id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-ink mb-8">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-100">
              <h2 className="font-bold text-ink">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-stone-500">
                  No conversations yet
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 border-b border-stone-100 text-left hover:bg-orange-50 transition-all ${
                      selectedChat?.id === chat.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-ink">{chat.participantName}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500 truncate">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">{chat.timestamp}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          {selectedChat ? (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-ink">{selectedChat.participantName}</h3>
                  <p className="text-sm text-stone-500">{selectedChat.participantRole}</p>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-2 hover:bg-stone-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.senderId === user?.id
                          ? "bg-orange-600 text-white"
                          : "bg-stone-100 text-ink"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      {msg.fileUrl && (
                        <a
                          href={msg.fileUrl}
                          className="text-xs mt-2 block underline hover:opacity-80"
                        >
                          📎 {msg.fileName}
                        </a>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === user?.id
                            ? "text-orange-100"
                            : "text-stone-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-stone-100"
              >
                {file && (
                  <div className="mb-2 flex items-center gap-2 bg-stone-100 p-2 rounded-lg">
                    <Paperclip size={16} className="text-stone-600" />
                    <span className="text-sm text-stone-600 flex-1">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-stone-500 hover:text-stone-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="p-2 hover:bg-stone-100 rounded-lg cursor-pointer">
                    <Paperclip size={20} className="text-stone-600" />
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-stone-200 rounded-full px-4 py-2 focus:outline-none focus:border-orange-600"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 flex items-center justify-center">
              <div className="text-center text-stone-500">
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}