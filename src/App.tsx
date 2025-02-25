import React, { useState, useMemo, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";
import { LLMAgent } from "./services/LLMAgent";
import { ViewModule } from "./types/DashboardTypes";
import { ChatMessage } from "./types/ChatTypes";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSwitcher from "./components/ThemeSwitcher";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC = () => {
  const [modules, setModules] = useState<ViewModule[]>(() => {
    const savedModules = localStorage.getItem("dashboardModules");
    return savedModules ? JSON.parse(savedModules) : [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      // Convert timestamp strings back to Date objects
      return parsedMessages.map((message: ChatMessage) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const llmAgent = useMemo(() => new LLMAgent(), []);
  const [chatModules, setChatModules] = useState<ViewModule[]>([]);

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
        //console.log("Attempting to remove modules:", response.removeModules);
        setModules((prev) => {
          const updatedModules = prev.filter((module) => {
            const shouldKeep = !response.removeModules.includes(module.id);
            //console.log(
            //  `Module ${module.id}: ${shouldKeep ? "keeping" : "removing"}`
            //);
            return shouldKeep;
          });
          console.log("Modules after removal:", updatedModules);
          return updatedModules;
        });
      }

      // Handle module updates for dashboard modules
      if (response.updateModules && response.updateModules.length > 0) {
        setModules((prev) =>
          prev.map((module) => {
            const update = response.updateModules.find(
              (u) => u.id === module.id
            );
            if (update) {
              return {
                ...module,
                config: { ...module.config, ...update.config },
                position: update.position || module.position,
              };
            }
            return module;
          })
        );
      }

      // Handle new modules - add to chat by default unless explicitly requested for dashboard
      if (response.addModules.length > 0) {
        const newModules = response.addModules.map((module, index) => ({
          ...module,
          id: `module-${Date.now()}-${index}`,
          position: {
            x: (index % 3) * 4,
            y: Math.floor(index / 3) * 8,
            w: 4,
            h: 4,
          },
        }));

        // Check if modules should go directly to dashboard (you'll need to add logic to determine this)
        const shouldAddToDashboard = message
          .toLowerCase()
          .includes("add to dashboard");
        if (shouldAddToDashboard) {
          setModules((prev) => [...prev, ...newModules]);
        } else {
          setChatModules((prev) => [...prev, ...newModules]);
        }
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

  const handleModuleDrop = (moduleId: string) => {
    // Move module from chat to dashboard
    const moduleToMove = chatModules.find((m) => m.id === moduleId);
    if (moduleToMove) {
      setModules((prev) => [...prev, moduleToMove]);
      setChatModules((prev) => prev.filter((m) => m.id !== moduleId));
    }
  };

  // Add useEffect to save modules whenever they change
  React.useEffect(() => {
    localStorage.setItem("dashboardModules", JSON.stringify(modules));
  }, [modules]);

  // Add useEffect to save messages whenever they change
  React.useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  //console.log("Rendering App component");

  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <ErrorBoundary>
          <div className="app">
            <ThemeSwitcher />
            <div className="chat-container">
              <ChatInterface
                onMessage={handleChatMessage}
                messages={messages}
                isLoading={isLoading}
                chatModules={chatModules}
              />
            </div>
            <div className="dashboard-container">
              <Dashboard
                modules={modules}
                onModulesChange={setModules}
                onModuleDrop={handleModuleDrop}
              />
            </div>
          </div>
        </ErrorBoundary>
      </DndProvider>
    </ThemeProvider>
  );
};

export default App;
