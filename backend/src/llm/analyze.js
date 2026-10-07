// bulid prompt here
// LLM call
// parse JSON
// return result
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildSystemPromptHistory,
} from "./LlmPrompt.js";
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
  const { result: rawLlmResponse, retries } = await callStructuredLlm({
    systemPrompt,
    userPrompt,
    llmProps,
  });

  // 3) Parse LLM response
  const parsed = normalizeAndValidate(rawLlmResponse, elements);
  const criticalElements = parsed.criticalElements;

  if (!Array.isArray(criticalElements)) {
    throw new Error("Invalid LLM response format");
  }

  const systemPromptHistory = buildSystemPromptHistory();

  //4) --- Set history for the chat  ---
  const combinedPrompt = `
  [System Instructions]
  ${systemPromptHistory}
  [User Input]
  ${userPrompt}
  `;
  const uiMessage = formatForChat(rawLlmResponse);

  await seedHistory(combinedPrompt, uiMessage);

  return {
    meta: {
      model: llmProps.modelName || process.env.DEFAULT_MODEL || "unknown",
      baseUrl: llmProps.baseUrl || process.env.OPENROUTER_BASE_URL || "unknown",
      retries,
    },
    uiMessage,
    criticalElements,
  };
}

// Message for Chat UI, based on LLM response
function formatForChat(parsed) {
  const automatable = (parsed.activities ?? []).filter(
    (el) => el.automatable === true,
  );
  if (automatable.length === 0) {
    return "No automatable BPMN activities were identified.";
  }

  const lines = automatable.map((el) => {
    return `- Element ID: ${el.id}\n Criteria: ${Array.isArray(el.criteria) && el.criteria.length > 0 ? el.criteria.join(", ") : "N/A"}\n Name: ${el.name ?? "N/A"}\n  Reason: ${el.reason}`;
  });

  return `Kritische Aktivitäten (${automatable.length}):\n${lines.join("\n")}`;
}
