// bulid prompt here
// LLM call
// parse JSON
// return result

import { buildSystemPrompt, buildUserPrompt } from "./prompt.js";

export async function analyze(elements) {
  // 1) Build prompts 
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(elements);

  console.log("SYSTEM PROMPT:\n", systemPrompt);
  console.log("USER PROMPT:\n", userPrompt);

  
  // 2) "Send request to LLM"
  const rawLlmResponse = await callLlmMock(elements); // simulate LLM call
  // später callLLMReal(userPrompt, systemPrompt);
  console.log("RAW LLM RESPONSE:\n", rawLlmResponse);

  // 3) Deserialize JSON response
  const parsed = JSON.parse(rawLlmResponse); // throws if invalid JSON

  // 4) Minimal validation
  if (!Array.isArray(parsed.criticalElements)) {
    throw new Error("Invalid LLM response format");
  }

  return {
    // später: Modellname ändern, Temperatur loggen, Prompt-Version ergänzen
    meta: {
      model: "mock",
      note: "LLM mocked for now",
    },
    result: parsed,
  };
}

// ===== MOCK LLM =====
async function callLlmMock(elements) {
 
  await new Promise((r) => setTimeout(r, 200));

  // Demo-Logik
  const criticalElements = elements.map((e, idx) => ({
    activityId: e.id,
    isCritical: idx % 2 === 0,
    reason: idx % 2 === 0
      ? "Mock: flagged as critical for demo"
      : "Mock: not critical",
  }));

  return JSON.stringify({ criticalElements });
}
