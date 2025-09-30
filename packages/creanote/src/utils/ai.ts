import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { Config } from "@/types";
import { log } from "./log";
// import { replaceTemplateVariables } from "./template";

export function hasAIConfigured(config: Config): boolean {
  return !!(
    config.settings.ai?.llm?.provider?.baseURL &&
    config.settings.ai?.llm?.model?.name
  );
}

export function getAPIKey(config: Config): string | null {
  const apiKeyConfig = config.settings.ai?.llm?.provider?.apiKey;
  if (!apiKeyConfig) return null;

  try {
    const envPath = path.join(process.cwd(), apiKeyConfig.path);
    if (!fs.existsSync(envPath)) return null;

    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");

    for (const line of lines) {
      const [key, value] = line.split("=");
      if (key?.trim() === apiKeyConfig.variable) {
        return value?.trim() || null;
      }
    }
  } catch (error) {
    log.error(`Failed to read API key: ${error}`);
  }

  return null;
}

export function createOpenAIClient(config: Config): OpenAI | null {
  if (!hasAIConfigured(config)) {
    return null;
  }

  const baseURL = config.settings.ai!.llm.provider.baseURL;
  const apiKey = getAPIKey(config);

  return new OpenAI({
    apiKey: apiKey || "dummy-key", // Some local APIs don't require keys
    baseURL: baseURL,
  });
}

export async function callLLM(
  config: Config,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): Promise<string | null> {
  const client = createOpenAIClient(config);
  if (!client) {
    log.error("AI is not configured. Run 'creanote init' to set up AI.");
    return null;
  }

  const model = config.settings.ai!.llm.model.name;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    log.error(`Failed to call AI API: ${error}`);
    return null;
  }
}

export async function streamLLM(
  config: Config,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): Promise<void> {
  const client = createOpenAIClient(config);
  if (!client) {
    log.error("AI is not configured. Run 'creanote init' to set up AI.");
    return;
  }

  const model = config.settings.ai!.llm.model.name;

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        process.stdout.write(content);
      }
    }
    console.log(); // New line after streaming
  } catch (error) {
    log.error(`Failed to stream AI API: ${error}`);
  }
}
