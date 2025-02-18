import OpenAI from "openai";
import { ViewModule } from "../types/DashboardTypes";
import promptTemplate from "./promptTemplate";

export class LLMAgent {
  private openai: OpenAI | null = null;
  private conversationHistory: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not found in environment variables");
      return;
    }

    const baseURL = import.meta.env.VITE_OPENAI_BASE_URL;
    if (!baseURL) {
      console.error("OpenAI API baseURL not found in environment variables");
      return;
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      baseURL: baseURL,
    });
  }

  async processUserRequest(
    message: string,
    existingModules: ViewModule[]
  ): Promise<{
    addModules: ViewModule[];
    removeModules: string[];
  }> {
    if (!this.openai) {
      console.error("OpenAI client not initialized");
      return {
        addModules: [],
        removeModules: [],
      };
    }

    // Create a description of existing modules including both ID and description
    const existingModulesDescription = existingModules
      .map((module) => `${module.id}: ${module.description || module.type}`)
      .join("\n");

    // Add user message to history
    this.conversationHistory.push({ role: "user", content: message });

    try {
      const openaiModel = import.meta.env.VITE_OPENAI_MODEL;
      if (!openaiModel) {
        console.error("OpenAI API model not found in environment variables");
      }

      console.log("Current history:", this.conversationHistory);

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: promptTemplate.replace(
            "{{existingModuleIds}}",
            existingModulesDescription
          ),
        },
        ...this.conversationHistory,
      ];

      console.log("Messages being sent:", messages);

      const response = await this.openai.chat.completions.create({
        model: openaiModel,
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      });

      // Add assistant response to history
      const assistantResponse = response.choices[0].message.content || "";
      // this.conversationHistory.push({
      //   role: "assistant",
      //   content: assistantResponse,
      // });

      console.log("Updated history:", this.conversationHistory);

      // Limit history to last 10 messages to prevent token overflow
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      let result;
      try {
        result = JSON.parse(assistantResponse);
      } catch (parseError) {
        console.error("Error parsing LLM response:", parseError);
        console.error("Raw response:", assistantResponse);
        result = {
          addModules: [],
          removeModules: [],
        };
      }

      // Ensure the response has the correct structure
      return {
        addModules: Array.isArray(result.addModules) ? result.addModules : [],
        removeModules: Array.isArray(result.removeModules)
          ? result.removeModules
          : [],
      };
    } catch (error) {
      console.error("Error processing request:", error);
      return {
        addModules: [],
        removeModules: [],
      };
    }
  }

  // Add method to clear history if needed
  clearHistory() {
    this.conversationHistory = [];
  }
}
