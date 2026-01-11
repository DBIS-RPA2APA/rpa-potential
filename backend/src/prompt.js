// nimmt BPMN-Element, 
// baut Prompt für LLM auf,
// gibt String zurück
export function buildSystemPrompt() {
  return `
You are an assistant that analyzes BPMN activities.
Return ONLY valid JSON.
`.trim();
}

export function buildUserPrompt(elements) {

  return JSON.stringify(
    {
      activities: elements.map((e) => ({
        id: e.id,
        type: e.type,
        name: e.name,
        documentation: e.documentation ?? null,
      })),
    },
    null,
    2
  );
}
