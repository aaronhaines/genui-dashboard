import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types/ChatTypes";
import "../styles/ChatComponent.css";
import { useDrag } from "react-dnd";
import ViewModuleRenderer from "./ViewModuleRenderer";

interface ChatModuleProps {
  module: ViewModule;
  onAddToDashboard: (moduleId: string) => void;
}

const DraggableModule: React.FC<ChatModuleProps> = ({
  module,
  onAddToDashboard,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MODULE",
    item: { id: module.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
      className="chat-module"
    >
      <button
        className="add-to-dashboard-button"
        onClick={() => onAddToDashboard(module.id)}
        title="Add to dashboard"
      >
        +
      </button>
      <ViewModuleRenderer module={module} />
    </div>
  );
};

interface ChatInterfaceProps {
  onMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  chatModules: ViewModule[];
  addToDashboardFirst: boolean;
  onTogglePreference: () => void;
  onAddLatestToDashboard: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onMessage,
  messages,
  isLoading,
  chatModules,
  addToDashboardFirst,
  onTogglePreference,
  onAddLatestToDashboard,
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

    const message = input.trim().toLowerCase();
    setInput(""); // Clear input immediately

    if (message === "add to dashboard" && chatModules.length > 0) {
      onAddLatestToDashboard();
      return;
    }

    await onMessage(message);
  };

  const handleAddModuleToDashboard = (moduleId: string) => {
    const moduleToAdd = chatModules.find((m) => m.id === moduleId);
    if (moduleToAdd) {
      onAddLatestToDashboard();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
            {message.content}
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {chatModules.map((module) => (
          <DraggableModule
            key={module.id}
            module={module}
            onAddToDashboard={handleAddModuleToDashboard}
          />
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            Thinking...
            <div className="message-timestamp">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what data you'd like to see..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any); // Type assertion to React.FormEvent
            }
          }}
        />
        <button type="submit">Send</button>
        <button
          type="button"
          className="module-preference-toggle"
          onClick={onTogglePreference}
        >
          {addToDashboardFirst ? "Add to Dashboard First" : "Add to Chat First"}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
