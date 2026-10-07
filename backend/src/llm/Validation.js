// Validates and normalizes the structured LLM response.
// - Activity IDs are matched exactly against the activity IDs of the model.
//   There is no fuzzy (prefix/substring) matching any more.
// - Unknown IDs, duplicate IDs, activities missing from the response, and
//   activities marked automatable without any criterion are not dropped
//   silently but reported in `diagnostics`.
// - An activity counts as predicted automatable iff automatable === true.
//   Activities missing from the response count as not automatable.

export const ACTIVITY_TYPES = [
  "task",
  "userTask",
  "serviceTask",
  "manualTask",
  "scriptTask",
  "sendTask",
  "receiveTask",
];

export function normalizeAndValidate(rawLlmResponse, elements) {
  if (!rawLlmResponse || !Array.isArray(rawLlmResponse.activities)) {
    throw new Error("Invalid LLM response format: activities missing");
  }

  const activityIds = new Set(
    elements.filter((el) => ACTIVITY_TYPES.includes(el.type)).map((el) => el.id),
  );

  const seenIds = new Set();
  const unknownIds = [];
  const duplicateIds = [];
  const automatableWithoutCriteria = [];
  const assessedActivities = [];

  for (const entry of rawLlmResponse.activities) {
    const id = typeof entry?.id === "string" ? entry.id.trim() : null;

    if (!id || !activityIds.has(id)) {
      unknownIds.push(entry?.id ?? null);
      continue;
    }
    if (seenIds.has(id)) {
      duplicateIds.push(id); // the first entry for an ID is kept
      continue;
    }
    seenIds.add(id);

    const criteria = Array.isArray(entry.criteria)
      ? [...new Set(entry.criteria)].sort((a, b) => a - b)
      : [];
    const automatable = entry.automatable === true;
    if (automatable && criteria.length === 0) {
      automatableWithoutCriteria.push(id); // violates the decision rule
    }

    assessedActivities.push({
      id,
      name: entry.name ?? null,
      automatable,
      score: criteria,
      reason: entry.reason ?? null,
    });
  }

  const missingIds = [...activityIds].filter((id) => !seenIds.has(id));

  // criticalElements keeps the previous structure ({id, name, score, reason})
  // used by metrics.js and the frontend.
  const criticalElements = assessedActivities
    .filter((activity) => activity.automatable)
    .map(({ automatable, ...rest }) => rest);

  return {
    criticalElements,
    assessedActivities,
    diagnostics: {
      unknownIds,
      duplicateIds,
      missingIds,
      automatableWithoutCriteria,
    },
  };
}
