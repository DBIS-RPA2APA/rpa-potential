// nimmt BPMN-Element,
// baut Prompt für User als Preview auf,
// gibt String zurück
export function buildSystemPromptPreview() {
  return `
You are an assistant that analyzes BPMN activities.
Return ONLY valid JSON.
`.trim();
}

export function buildUserPromptPreview(elements) {
  const lines = elements.map((el) => {
    return `- Element ID: ${el.id}\n  Name: ${el.name ?? "N/A"}`;
  });
  return `BpmnElemente: (${elements.length}):\n${lines.join("\n")}`;
}

export async function buildPreviewPrompt(elements) {
  const systemPrompt = buildSystemPromptPreview();
  const userPrompt = buildUserPromptPreview(elements);
  return { systemPrompt, userPrompt };
}
