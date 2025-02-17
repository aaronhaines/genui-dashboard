import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";
import { LLMAgent } from "./services/LLMAgent";
import { ViewModule } from "./types/DashboardTypes";
import { ChatMessage } from "./types/ChatTypes";
import "./App.css";

const App: React.FC = () => {
  const [modules, setModules] = useState<ViewModule[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const llmAgent = new LLMAgent();

  const handleChatMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await llmAgent.processUserRequest(message);
      console.log("LLM Response:", response);

      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Updated dashboard with ${response.addModules.length} new modules and removed ${response.removeModules.length} modules.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Remove modules if specified
      if (response.removeModules.length > 0) {
        setModules((prev) =>
          prev.filter((module) => !response.removeModules.includes(module.id))
        );
      }

      // Add new modules
      if (response.addModules.length > 0) {
        setModules((prev) => [...prev, ...response.addModules]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  console.log("Rendering App component");

  return (
    <div className="app">
      <div className="chat-container">
        <ChatInterface onMessage={handleChatMessage} messages={messages} />
      </div>
      <div className="dashboard-container">
        <Dashboard modules={modules} onModulesChange={setModules} />
      </div>
    </div>
  );
};

export default App;
