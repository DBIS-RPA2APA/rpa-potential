// nimmt BPMN-Element,
// baut Prompt für User als Preview auf,
// gibt String zurück
export function buildSystemPromptPreview() {
  return `
You are an assistant that analyzes BPMN activities.
Return ONLY valid JSON.
`.trim(); // trim() entfernt Leerzeichen
}

export function buildUserPromptPreview(elements) {
  return JSON.stringify(
    {
      activities: elements.map((e) => ({
        id: e.id,
        type: e.type,
        name: e.name,
        documentation: e.documentation ?? null,
        poolName: e.poolName ?? null,
        laneName: e.laneName ?? null,
        incomingFlowElementIds: e.incomingFlowElementIds ?? [],
        outgoingFlowElementIds: e.outgoingFlowElementIds ?? [],
        outgoingMessageFlowsToElementIds:
          e.outgoingMessageFlowsToElementIds ?? [],
        incomingMessageFlowsFromElementIds:
          e.incomingMessageFlowsFromElementIds ?? [],
        incomingDataFromElementIds: e.incomingDataFromElementIds ?? [],
        outgoingDataToElementIds: e.outgoingDataToElementIds ?? [],
        associatedElementIds: e.associatedElementIds ?? [],
      })),
    },
    null,
    2,
  );
}

export async function buildPreviewPrompt(elements) {
  const systemPrompt = buildSystemPromptPreview();
  const userPrompt = buildUserPromptPreview(elements);
  return { systemPrompt, userPrompt };
}
