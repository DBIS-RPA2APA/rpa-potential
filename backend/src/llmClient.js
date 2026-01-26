// LLM call
// parse JSON
// return result
// Austauschbare Schnittstelle für verschiedene LLM-Anbieter

export async function callLlm({ elements, systemPrompt, userPrompt }) {
  await new Promise((r) => setTimeout(r, 200));

  const criticalElements = elements
    .filter((_, idx) => idx % 2 === 0)
    .map((e) => ({
      id: e.id,
      name: e.name ?? null,
      reason: "Mock: flagged as critical for demo",
    }));

  console.log("Mock LLM called with prompts:\n", { systemPrompt, userPrompt });
  return { criticalElements};
}
