import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types/ChatTypes";

interface ChatInterfaceProps {
  onMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onMessage,
  messages,
}) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await onMessage(input);
    setInput("");
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what financial data you'd like to see..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;
