import { callLLM } from "@/utils/ai";
import { question, closeReadline } from "@/utils";
import type { Config } from "@/types";

export async function ask(config: Config, questionText?: string) {
  if (!config.settings.ai) {
    console.error("AI is not configured. Please run 'creanote ai setup' to configure AI settings.");
    process.exit(1);
  }

  const { llm } = config.settings.ai;
  
  let userQuestion = questionText;
  
  // If no question provided as argument, ask for it
  if (!userQuestion) {
    console.log("Usage: creanote ai ask \"your question\"");
    console.log("Or provide your question now:");
    userQuestion = await question("What would you like to ask? ");
  }

  if (!userQuestion || userQuestion.trim() === "") {
    console.error("No question provided.");
    console.error("Usage: creanote ai ask \"your question\"");
    process.exit(1);
  }

  try {
    console.log("🤖 Thinking...");
    
    const systemPrompt = llm.prompt.ask.system;
    const userPrompt = llm.prompt.ask.user.replace("{question}", userQuestion);
    
    const response = await callLLM(systemPrompt, userPrompt);
    
    console.log("\n" + response + "\n");
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  } finally {
    closeReadline();
  }
} 