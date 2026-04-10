// bulid prompt here
// LLM call
// parse JSON
// return result
import { buildSystemPrompt, buildUserPrompt } from "./LlmPrompt.js";
import {
  callStructuredLlm,
  resetDefaultHistory,
  seedHistory,
} from "./llmClient.js";
import { normalizeAndValidate } from "./Validation.js";

// main function that analyzes BPMN elements -> BpmnElement list
export async function analyze(elements, llmProps = {}) {
  resetDefaultHistory();

  // 1) Build prompts
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(elements);

  // 2) Call LLM, get raw response
  const rawLlmResponse = await callStructuredLlm({
    systemPrompt,
    userPrompt,
    llmProps,
  });

  // 3) Parse LLM response
  const parsed = normalizeAndValidate(rawLlmResponse, elements);
  const criticalElements = parsed.criticalElements;

  if (!Array.isArray(parsed.criticalElements)) {
    throw new Error("Invalid LLM response format");
  }

  //4) --- Set history for the chat  ---
  const combinedPrompt = `
  [System Instructions]
  ${systemPrompt}
  [User Input]
  ${userPrompt}
  `;
  const uiMessage = formatForChat(rawLlmResponse);

  await seedHistory(combinedPrompt, uiMessage);

  return {
    meta: {
      model: llmProps.modelName || process.env.DEFAULT_MODEL || "unknown",
      baseUrl: llmProps.baseUrl || process.env.OPENROUTER_BASE_URL || "unknown",
      note: "LangChain and OpenRouter",
    },
    uiMessage,
    criticalElements,
  };
}

// Message for Chat UI, based on LLM response
function formatForChat(parsed) {
  if (!parsed.criticalElements || parsed.criticalElements.length === 0) {
    return "No automatable BPMN elements were identified.";
  }

  const lines = parsed.criticalElements.map((el) => {
    return `- Element ID: ${el.id}\n Score: ${Array.isArray(el.score) ? el.score.join(", ") : "N/A"}\n isRelevant: ${el.isRelevant ?? "N/A"}\n Name: ${el.name ?? "N/A"}\n  Reason: ${el.reason}`;
  });

  return `Kritische Aktivitäten (${parsed.criticalElements.length}):\n${lines.join("\n")}`;
}
