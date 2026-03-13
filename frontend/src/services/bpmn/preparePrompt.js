import { extractFromXml } from "./extractFromXml.js";
import { getPromptPreview } from "../api/analyzeApi.js";

// --- Service function: prepares the BPMN diagram for prompt generation
//  saving current diagram as XML, extracting relevant elements,
// and calling the backend API to get the prompt preview. Returns the preview text,
// extracted elements, and API response for further use in the UI. ---
export async function preparePromptPreview(modeler) {
  const { xml } = await modeler.saveXML({ format: true });
  const elements = extractFromXml(xml); // Array of relevant BPMN elements

  const response = await getPromptPreview(elements); // calls backend /api/preview

  const previewText =
    `[PREVIEW – SYSTEM PROMPT]\n` +
    `${response.systemPrompt ?? ""}\n\n` +
    `[PREVIEW – USER PROMPT]\n` +
    `${response.userPrompt ?? ""}`;

  return { previewText, elements, response };
}
