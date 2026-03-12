// bulid prompt here
// LLM call
// parse JSON
// return result
import { buildSystemPrompt, buildUserPrompt } from "./LlmPrompt.js";
import { callLlm } from "./LlmClient.js";

// main function that analyzes BPMN elements
export async function analyze(elements, llmProps = {}) {
  // 1) Build prompts -> later with LangChain
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(elements);

  // 2) Call LLM, get raw response -> later with LangChain
  const rawLlmResponse = await callLlm({
    systemPrompt,
    userPrompt,
    llmProps,
  });

  // 3) Parse LLM response
  // normalize and validate response
  //const parsed = normalizeAndValidate(rawLlmResponse);
  const criticalElements = rawLlmResponse.criticalElements;

  if (!Array.isArray(rawLlmResponse.criticalElements)) {
    throw new Error("Invalid LLM response format");
  }

  return {
    meta: {
      model: llmProps.modelName || process.env.DEFAULT_MODEL || "unknown",
      baseUrl: llmProps.baseUrl || process.env.OPENROUTER_BASE_URL || "unknown",
      note: "LangChain and OpenRouter",
    },
    uiMessage: formatForChat(rawLlmResponse),
    criticalElements,
  };
}

function normalizeAndValidate(llmResponse) {
  // ensure structure, types, etc.
  return llmResponse;
}

function formatForChat(parsed) {
  if (!parsed.criticalElements || parsed.criticalElements.length === 0) {
    return "No automatable BPMN elements were identified.";
  }

  const lines = parsed.criticalElements.map((el) => {
    return `- Element ID: ${el.id}\n  Name: ${el.name ?? "N/A"}\n  Reason: ${el.reason}`;
  });

  return `Kritische Aktivitäten (${parsed.criticalElements.length}):\n${lines.join("\n")}`;
}
