import { callLLM } from "@/utils/ai";
import { question, closeReadline } from "@/utils";
import type { Config } from "@/types";

export async function chat(config: Config) {
  if (!config.settings.ai) {
    console.error("AI is not configured. Please run 'creanote ai setup' to configure AI settings.");
    process.exit(1);
  }

  const { llm } = config.settings.ai;
  
  console.log("🤖 AI Chat Mode");
  console.log("Type 'exit' or 'quit' to end the chat.\n");

  const conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];
  
  try {
    while (true) {
      const userMessage = await question("You: ");
      
      if (userMessage.toLowerCase() === "exit" || userMessage.toLowerCase() === "quit") {
        console.log("👋 Goodbye!");
        break;
      }

      if (!userMessage || userMessage.trim() === "") {
        continue;
      }

      console.log("🤖 Thinking...");
      
      // Build conversation context
      const messages = [
        { role: "system" as const, content: llm.prompt.chat.system },
        ...conversationHistory,
        { role: "user" as const, content: userMessage }
      ];

      // Create a simple conversation by combining messages
      const systemPrompt = llm.prompt.chat.system;
      const userPrompt = llm.prompt.chat.user.replace("{message}", userMessage);
      
      // Add conversation history context if available
      const historyContext = conversationHistory.length > 0 
        ? "\n\nPrevious conversation:\n" + conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n")
        : "";
      
      const fullUserPrompt = userPrompt + historyContext;
      
      const response = await callLLM(systemPrompt, fullUserPrompt);
      
      console.log(`AI: ${response}\n`);
      
      // Add to conversation history
      conversationHistory.push({ role: "user", content: userMessage });
      conversationHistory.push({ role: "assistant", content: response });
      
      // Keep only last 10 messages to avoid context overflow
      if (conversationHistory.length > 10) {
        conversationHistory.splice(0, 2);
      }
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  } finally {
    closeReadline();
  }
} 