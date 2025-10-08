import fs from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import {
  loadConfig,
  log,
  callLLM,
  streamLLM,
  hasAIConfigured,
  replaceTemplateVariables,
  buildPathTemplate,
  // createOpenAIClient,
  generateUniqueFilename,
} from "@/utils";

export async function askAI(question: string) {
  const config = loadConfig();
  if (!config) {
    log.error("Invalid config. Run 'creanote init' to reset.");
    return;
  }

  if (!hasAIConfigured(config)) {
    log.error("AI is not configured. Run 'creanote init' to set up AI.");
    return;
  }

  const systemPrompt = config.settings.ai!.llm.prompt.ask.system;
  const userPrompt = replaceTemplateVariables(
    config.settings.ai!.llm.prompt.ask.user,
    { ask: question }
  );

  log.info(`Asking AI: ${question}`);
  log.blank();

  await streamLLM(config, [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);
}

export async function chatWithAI() {
  const config = loadConfig();
  if (!config) {
    log.error("Invalid config. Run 'creanote init' to reset.");
    return;
  }

  if (!hasAIConfigured(config)) {
    log.error("AI is not configured. Run 'creanote init' to set up AI.");
    return;
  }

  const systemPrompt = config.settings.ai!.llm.prompt.chat.system;
  const messages: any[] = [{ role: "system", content: systemPrompt }];

  log.section("Interactive AI Chat");
  log.info("Type your messages below. Type 'exit' or 'quit' to end the chat.");
  log.blank();

  try {
    while (true) {
      const userMessage = await input({
        message: "You:",
        validate: (input) =>
          input.length > 0 ? true : "Please enter a message",
      });

      if (
        userMessage.toLowerCase() === "exit" ||
        userMessage.toLowerCase() === "quit"
      ) {
        log.info("Chat ended");
        break;
      }

      const userPrompt = replaceTemplateVariables(
        config.settings.ai!.llm.prompt.chat.user,
        { chat: userMessage }
      );

      messages.push({ role: "user", content: userPrompt });

      process.stdout.write("AI: ");
      await streamLLM(config, messages);

      // Get the last response to add to conversation history
      const response = await callLLM(config, messages);
      if (response) {
        messages.push({ role: "assistant", content: response });
      }

      log.blank();
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      log.blank();
      log.info("Chat ended");
    } else {
      log.error(
        `Chat error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

export async function addWithAI(
  templateName: string,
  topic: string,
  options: { date?: string; filename?: string; extension?: string }
) {
  const config = loadConfig();
  if (!config) {
    log.error("Invalid config. Run 'creanote init' to reset.");
    return;
  }

  if (!hasAIConfigured(config)) {
    log.error("AI is not configured. Run 'creanote init' to set up AI.");
    return;
  }

  // Find template by name
  const template = config.settings.templates.find(
    (t) => t.name === templateName
  );
  if (!template) {
    const availableTypes = config.settings.templates
      .map((t) => t.name)
      .join(", ");
    log.error(
      `Invalid template: ${templateName}. Available templates: ${availableTypes}`
    );
    return;
  }

  const systemPrompt = config.settings.ai!.llm.prompt.add.system;
  const userPrompt = replaceTemplateVariables(
    config.settings.ai!.llm.prompt.add.user,
    { add: topic }
  );

  log.info(`Generating ${template.description.toLowerCase()} about: ${topic}`);

  const aiContent = await callLLM(config, [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  if (!aiContent) {
    log.error("Failed to generate content with AI");
    return;
  }

  // Create a temporary template with AI-generated content
  const aiTemplate = {
    ...template,
    path: "", // We'll provide content directly
  };

  // Use the AI content as the template content
  const targetDate = options.date ? new Date(options.date) : new Date();
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  // Replace any template variables in the AI content
  const finalContent = aiContent.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const variables: Record<string, string> = {
      date: `${year}-${month}-${day}`,
      created_at: targetDate.toISOString(),
      year: year.toString(),
      month: month,
      day: day,
    };
    return variables[key.trim()] || `{{${key}}}`;
  });

  // Create the file manually since we have custom content
  const { getWeekNumber } = await import("@/utils");
  const week = String(getWeekNumber(targetDate)).padStart(2, "0");

  // Use custom extension if provided, otherwise use template extension
  const finalExtension = options.extension || template.ext;

  // Build and replace template variables in target path
  const pathTemplate = buildPathTemplate(
    template.target,
    options.filename,
    finalExtension
  );
  let targetPath = replaceTemplateVariables(pathTemplate, {
    year: year.toString(),
    month: month,
    day: day,
    week: week,
    ext: finalExtension,
  });

  // Generate unique filename from topic if no custom filename
  if (!options.filename) {
    // Generate filename from topic
    const pathParts = targetPath.split("/");
    const folderPath = pathParts.slice(0, -1).join("/");
    const uniqueFilename = generateUniqueFilename(
      path.join(process.cwd(), config.settings.basePath, folderPath),
      topic,
      finalExtension
    );
    pathParts[pathParts.length - 1] = uniqueFilename;
    targetPath = pathParts.join("/");
  }

  // Build full file path
  const fullPath = path.join(
    process.cwd(),
    config.settings.basePath,
    targetPath
  );
  const folderPath = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Write file with AI-generated content
  fs.writeFileSync(fullPath, finalContent);

  const relativePath = path.relative(process.cwd(), fullPath);
  log.success(
    `AI-generated ${template.description.toLowerCase()} added: ${relativePath}`
  );
}
