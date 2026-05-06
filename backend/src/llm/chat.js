// for normal Chat messages
import { callChatLlm } from "./llmClient.js";

// main function for chat interactions
export async function chat(message, llmProps = {}) {
  const systemPrompt = `
    You are a helpful assistant in BPMN analysis.
    Answer questions about the previously extracted tasks and analysis results.
    Use the existing conversation history.
    Express yourself clearly and precisely.
    `;
  // 2) Call LLM, get raw response
  const result = await callChatLlm({
    systemPrompt,
    userPrompt: message,
    llmProps,
  });

  // warum message als return?
  return {
    message:
      typeof result.content === "string"
        ? result.content
        : JSON.stringify(result.content),
  };
}
