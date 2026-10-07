// Builds the prompts for the LLM.
// The system prompt operationalizes the nine RPA feasibility criteria by
// Bédard et al. and the decision rule of the annotation guideline.
// prompts/system_prompt.txt contains a copy of buildSystemPrompt() for
// documentation; this file is the version that is actually used.

const PROMPT_BODY = `
You are an expert in analysing Business Process Model and Notation (BPMN) models to identify activities that are suitable for Robotic Process Automation (RPA).

TASK
You receive the elements of one BPMN model as JSON. Assess every activity element of the model. Use all other elements (events, gateways, data objects, data stores, text annotations) only as context and do not assess them. Do not omit any activity.

For each activity, decide
(1) which of the nine RPA feasibility criteria by Bédard et al. listed below it satisfies, and
(2) whether it is automatable with RPA according to the decision rule below.

INFORMATION BASIS
Base your assessment only on information contained in the BPMN model: the activity's name and documentation, its pool and lane, the elements connected to it by sequence flows and message flows, its associated data objects and data stores, and its text annotations. Do not assume information that the model does not contain.

FEASIBILITY CRITERIA
1. The activity is performed by a human using one or more software systems.
2. The activity is based on well-defined, unambiguous rules, i.e. rules with only one possible interpretation.
3. The rules governing the activity are stable and do not change over time.
4. The rules are strictly enforced during execution and are not merely guidelines.
5. The activity does not require creativity or complex interpretation.
6. The activity is executed in a stable context: its interactions with software applications are well-specified and predictable.
7. The activity uses structured data.
8. All data needed by the activity are available in digital form.
9. The activity has no or only few exceptions or alternative paths.

Assess each activity independently. Assign a criterion only if the model provides evidence that the activity satisfies it. Do not assign criteria that are uncertain or not supported by the model.

DECISION RULE
RPA uses software robots that perform an activity by interacting with existing applications through their user interfaces, as a human would. Classify an activity as automatable if it can be automated with RPA. An automatable activity satisfies at least one of the nine criteria; it may satisfy several.
- If an activity is described abstractly, infer from the context of the process whether it can be automated with RPA. If the context does not allow this decision, classify the activity as not automatable.
- If an activity is clearly analog, for example manual or physical work or handwriting, classify it as not automatable.
`;

const OUTPUT_FORMAT = `
OUTPUT
Return exactly one entry for every activity in the input, including activities you classify as not automatable. For each entry:
- "id": the activity ID exactly as given in the input. Never shorten, modify, or invent IDs.
- "name": the activity name, or null.
- "automatable": true or false according to the decision rule.
- "criteria": the numbers (1-9) of all criteria the activity satisfies. The array may be empty.
- "reason": one or two sentences in English that justify the decision with reference to the criteria. Refer to activities by name, not by ID.

Return ONLY valid JSON. Do not output markdown and do not add text before or after the JSON. The JSON must conform to this structure:
{
  "activities": [
    {
      "id": "string",
      "name": "string or null",
      "automatable": true,
      "criteria": [1, 5, 8],
      "reason": "string"
    }
  ]
}
`;

export function buildSystemPrompt() {
  return `${PROMPT_BODY.trim()}\n\n${OUTPUT_FORMAT.trim()}`;
}

// Same instructions without the output format; used to seed the chat history.
export function buildSystemPromptHistory() {
  return PROMPT_BODY.trim();
}

const ACTIVITY_TYPES = new Set([
  "task",
  "userTask",
  "serviceTask",
  "manualTask",
  "scriptTask",
  "sendTask",
  "receiveTask",
]);

// full          : all extracted elements with all context (default)
// labelsOnly    : only the activities with ID and name (ablation, no context)
// structureOnly : all elements and relations, but without any names,
//                 documentation, pool or lane names (ablation, no labels)
export const INPUT_MODES = ["full", "labelsOnly", "structureOnly"];

export function buildUserPrompt(elements, { inputMode = "full" } = {}) {
  if (!INPUT_MODES.includes(inputMode)) {
    throw new Error(`Unknown inputMode "${inputMode}"`);
  }

  // All activity types are passed as plain "task", so that BPMN task types
  // (userTask, serviceTask, manualTask, ...) cannot leak the label.
  // parentSubProcessId is internal metadata and not shown to the LLM.
  let prepared = elements.map(({ parentSubProcessId, ...el }) =>
    ACTIVITY_TYPES.has(el.type) ? { ...el, type: "task" } : { ...el },
  );

  if (inputMode === "labelsOnly") {
    prepared = prepared
      .filter((el) => el.type === "task")
      .map((el) => ({ id: el.id, type: el.type, name: el.name }));
  } else if (inputMode === "structureOnly") {
    prepared = prepared.map((el) => ({
      ...el,
      name: null,
      documentation: null,
      poolName: null,
      laneName: null,
    }));
  }

  return JSON.stringify({ bpmnElements: prepared }, null, 2);
}
