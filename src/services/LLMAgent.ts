import OpenAI from "openai";
import { ViewModule } from "../types/DashboardTypes";

export class LLMAgent {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not found in environment variables");
      return;
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
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

    // Create a list of existing module IDs
    const existingModuleIds = existingModules
      .map((module) => module.id)
      .join(", ");

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a financial dashboard assistant that ONLY responds in valid JSON format.
            Never include explanatory text outside the JSON structure.
            
            Available module types: 'lineChart', 'barChart', 'dataTable', 'metrics'.
            Current modules: [${existingModuleIds}]. When referring to modules, use the unique ID associated with each module.
            
            Response must always be in this exact format:
            {
              "addModules": [
                {
                  "id": "unique-string",
                  "type": "one-of-available-types",
                  "config": {
                    "title": "string",
                    "dataSource": "string",
                    "timeRange": "string"
                  },
                  "position": { "x": 0, "y": 0, "w": 6, "h": 4 }
                }
              ],
              "removeModules": ["id-to-remove"]
            }

            Even if no actions are needed, respond with empty arrays:
            {
              "addModules": [],
              "removeModules": []
            }`,
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
