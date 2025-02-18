import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";
import { LLMAgent } from "./services/LLMAgent";
import { ViewModule } from "./types/DashboardTypes";
import { ChatMessage } from "./types/ChatTypes";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSwitcher from "./components/ThemeSwitcher";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  const [modules, setModules] = useState<ViewModule[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    try {
      const response = await llmAgent.processUserRequest(message, modules);
      console.log("Current modules:", modules);
      console.log("LLM Response:", response);

      // Handle module removal first
      if (response.removeModules.length > 0) {
        console.log("Attempting to remove modules:", response.removeModules);
        setModules((prev) => {
          const updatedModules = prev.filter((module) => {
            const shouldKeep = !response.removeModules.includes(module.id);
            console.log(
              `Module ${module.id}: ${shouldKeep ? "keeping" : "removing"}`
            );
            return shouldKeep;
          });
          console.log("Modules after removal:", updatedModules);
          return updatedModules;
        });
      }

      // Then handle adding new modules
      if (response.addModules.length > 0) {
        console.log("Adding new modules:", response.addModules);
        setModules((prev) => {
          // Adjust width to 30% and distribute modules horizontally
          const newModules = response.addModules.map((module, index) => ({
            ...module,
            position: {
              x: (index % 3) * 4, // 3 columns, each 4 units wide (30% of 12)
              y: Math.floor(index / 3) * 8, // Adjust the Y position based on the row
              w: 4, // width: 30% of the dashboard (12 units)
              h: 4, // height
            },
          }));
          const updatedModules = [...prev, ...newModules];
          console.log("Modules after addition:", updatedModules);
          return updatedModules;
        });
      }

      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Updated dashboard: ${
          response.addModules.length > 0
            ? `added ${response.addModules.length} modules`
            : ""
        } ${
          response.removeModules.length > 0
            ? `removed ${response.removeModules.length} modules`
            : ""
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Rendering App component");

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="app">
          <ThemeSwitcher />
          <div className="chat-container">
            <ChatInterface
              onMessage={handleChatMessage}
              messages={messages}
              isLoading={isLoading}
            />
          </div>
          <div className="dashboard-container">
            <Dashboard modules={modules} onModulesChange={setModules} />
          </div>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
