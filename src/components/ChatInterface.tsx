import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../types/ChatTypes";
import "../styles/ChatComponent.css";
import { useDrag } from "react-dnd";
import ViewModuleRenderer from "./ViewModuleRenderer";

interface ChatModuleProps {
  module: ViewModule;
}

const DraggableModule: React.FC<ChatModuleProps> = ({ module }) => {
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
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onMessage,
  messages,
  isLoading,
  chatModules,
  addToDashboardFirst,
  onTogglePreference,
}) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("chatMuted");
    return saved ? JSON.parse(saved) : false;
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Save mute preference
  useEffect(() => {
    localStorage.setItem("chatMuted", JSON.stringify(isMuted));
  }, [isMuted]);

  // Load and log available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log(
        "Available voices:",
        availableVoices.map((voice) => ({
          name: voice.name,
          lang: voice.lang,
          default: voice.default,
        }))
      );
    };

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial load for Firefox

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    // Try to use Samantha, fall back to any US English voice
    const samanthaVoice = voices.find((voice) =>
      voice.name.includes("Samantha")
    );
    const usEnglishVoice = voices.find((voice) => voice.lang === "en-US");

    utterance.voice = samanthaVoice || usEnglishVoice || null;

    if (utterance.voice) {
      console.log("Using voice:", utterance.voice.name);
    }

    window.speechSynthesis.speak(utterance);
  };

  // Effect to handle new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        speak(lastMessage.content);
      }
    }
  }, [messages]);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Cancel any ongoing speech when user sends new message
    window.speechSynthesis.cancel();

    onMessage(input);
    setInput("");
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
          <DraggableModule key={module.id} module={module} />
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
        <div className="button-group">
          <button type="submit">Send</button>
          <button
            type="button"
            className="module-preference-toggle"
            onClick={onTogglePreference}
          >
            {addToDashboardFirst
              ? "Add to Dashboard First"
              : "Add to Chat First"}
          </button>
          <button
            type="button"
            className="mute-toggle"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
