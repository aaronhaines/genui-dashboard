import OpenAI from "openai";
import { ViewModule } from "../types/DashboardTypes";
import promptTemplate from "./promptTemplate";

export class LLMAgent {
  private openai: OpenAI | null = null;

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

    try {
      const openaiModel = import.meta.env.VITE_OPENAI_MODEL;
      if (!openaiModel) {
        console.error("OpenAI API model not found in environment variables");
      }
      const response = await this.openai.chat.completions.create({
        model: openaiModel,
        messages: [
          {
            role: "system",
            content: promptTemplate.replace(
              "{{existingModuleIds}}",
              existingModulesDescription
            ),
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      let result;
      try {
        const content =
          response.choices[0].message.content ||
          '{"addModules":[], "removeModules":[]}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error("Error parsing LLM response:", parseError);
        console.error("Raw response:", response.choices[0].message.content);
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
}
