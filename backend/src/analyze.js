// bulid prompt here
// LLM call
// parse JSON
// return result
import { buildSystemPrompt, buildUserPrompt } from "./LlmPrompt.js";
import { callLlm } from "./LlmClient.js";

// main function that analyzes BPMN elements

export async function analyze(elements) {
  // 1) Build prompts zunächst nur preview prompt
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(elements);

  // 2) Call LLM, get raw response
  // später callLLMReal(userPrompt, systemPrompt);
  const rawLlmResponse = await callLlm({ systemPrompt, userPrompt, elements });
  
  // 3) Parse LLM response
  // normalize and validate response
  //const parsed = normalizeAndValidate(rawLlmResponse);

  // 4) Format for UI, for user in Chat
  const uiMessage = formatForChat(rawLlmResponse);

  console.log("RAW LLM RESPONSE:\n", rawLlmResponse);

  const criticalElements = rawLlmResponse.criticalElements;

  if (!Array.isArray(rawLlmResponse.criticalElements)) {
    throw new Error("Invalid LLM response format");
  }

  return {
    meta: {
      model: "mock",
      note: "LLM mocked for now",
    },
    uiMessage,
    criticalElements,
  };
}

function normalizeAndValidate(llmResponse) {
  // ensure structure, types, etc.
  return llmResponse;
}



function formatForChat(parsed) {
  if (parsed.criticalElements.length === 0) {
    return "No critical BPMN elements were identified.";
  }

  const lines = parsed.criticalElements.map((el) => {
    return `- Element ID: ${el.id}\n  Name: ${el.name ?? "N/A"}\n  Reason: ${el.reason}`;
  });

  return `Kritische Aktivitäten (${parsed.criticalElements.length}):\n${lines.join("\n")}`;
}
