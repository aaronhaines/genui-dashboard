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

  async processUserRequest(message: string): Promise<{
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

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a financial dashboard assistant. You help users by creating and managing dashboard modules.
            Available module types are: 'lineChart', 'barChart', 'dataTable', 'metrics'.
            Respond in JSON format with modules to add or remove based on the user's request.
            Example response format: 
            {
              "addModules": [{
                "id": "unique-id",
                "type": "lineChart",
                "config": {
                  "title": "Stock Price Trends",
                  "dataSource": "AAPL",
                  "timeRange": "1M"
                },
                "position": { "x": 0, "y": 0, "w": 6, "h": 4 }
              }],
              "removeModules": ["module-id-to-remove"]
            }`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const result = JSON.parse(
        response.choices[0].message.content ||
          '{"addModules":[], "removeModules":[]}'
      );
      return result;
    } catch (error) {
      console.error("Error processing request:", error);
      return {
        addModules: [],
        removeModules: [],
      };
    }
  }
}
