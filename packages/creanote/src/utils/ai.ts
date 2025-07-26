import fs from "fs";
import { loadConfig } from "./config";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<string> {
  const config = loadConfig();
  
  if (!config.settings.ai) {
    throw new Error("AI is not configured");
  }

  const { llm } = config.settings.ai;
  
  // Load API key
  let apiKey = "";
  if (llm.provider.apiKeyPath === ".env") {
    if (fs.existsSync(".env")) {
      const envContent = fs.readFileSync(".env", "utf-8");
      const apiKeyMatch = envContent.match(/API_KEY=(.+)/);
      if (apiKeyMatch) {
        apiKey = apiKeyMatch[1].trim();
      }
    }
  } else {
    if (fs.existsSync(llm.provider.apiKeyPath)) {
      apiKey = fs.readFileSync(llm.provider.apiKeyPath, "utf-8").trim();
    }
  }

  if (!apiKey) {
    throw new Error("API key not found. Please check your configuration.");
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  const requestBody: ChatCompletionRequest = {
    model: llm.modelName,
    messages,
    temperature,
    max_tokens: 2000
  };

  try {
    const response = await fetch(`${llm.provider.apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data: ChatCompletionResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from AI model");
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to call LLM: ${error.message}`);
    }
    throw new Error("Failed to call LLM: Unknown error");
  }
} 