// validate Result, just relevant Tasks
// 1. Entspricht Struktur nicht erwarteten JSON-Schema, löst Langchain4j OutputParsingException
// -> dreimal die ursprüngliche Anfrage erneut gesendet -> ich mit structuredOutput gelöst
//     2.Filtern: boolesche Wert isRelevant fehlt und im zweiten Versuch ergänzt
//     -> alle Elemente mit isRelevant = false entfernt
// 3.ID-Validierung: unvollständige oder fehlerhafte id-Werte, die nicht existieren
// 4.Deduplication: ids daher gegen tatsächlich im Prozess vorhandenen Aktivitäts-ids geprüft

export function normalizeAndValidate(rawLlmResponse, elements) {
  if (!rawLlmResponse || !Array.isArray(rawLlmResponse.criticalElements)) {
    throw new Error("Invalid LLM response format: criticalElements missing");
  }

  // LLM response filtered
  const filtered = (rawLlmResponse.criticalElements ?? []).filter(
    (e) => e.isRelevant === true,
  );

  // Extract existing activity IDs from input BpmnElements
  const existingActivityIds = elements
    .filter((el) =>
      [
        "task",
        "userTask",
        "serviceTask",
        "manualTask",
        "scriptTask",
        "sendTask",
        "receiveTask",
      ].includes(el.type),
    )
    .map((el) => el.id);

  const resolved = filtered
    .map((element) => {
      const resolvedId = uniqueActivityId(element.id, existingActivityIds);
      if (!resolvedId) {
        return null;
      }
      return resolvedId === element.id
        ? element
        : { ...element, id: resolvedId };
    })
    .filter(Boolean);

  // remove duplicates based on id
  const seenIds = new Set();
  const resolvedDistinct = resolved.filter((el) => {
    if (seenIds.has(el.id)) {
      return false;
    }
    seenIds.add(el.id);
    return true;
  });

  return {
    criticalElements: resolvedDistinct,
  };
}

function uniqueActivityId(partialId, existingActivityIds) {
  if (!partialId || typeof partialId !== "string") return null;

  if (partialId in existingActivityIds) {
    return partialId;
  }
  // if only one existing id starts with the partialId, return it
  const prefixMatch = existingActivityIds.filter((id) =>
    id.startsWith(partialId),
  );
  if (prefixMatch.length === 1) {
    return prefixMatch[0];
  }
  // if only one existing id includes the partialId, return it
  const substringMatch = existingActivityIds.filter((id) =>
    id.includes(partialId),
  );
  if (substringMatch.length === 1) {
    return substringMatch[0];
  }
  // otherwise, return null to indicate no unique match found
  return null;
}
