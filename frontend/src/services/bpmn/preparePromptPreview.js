import { extractFromXml } from "./extractFromXml.js";
import { preparePrompt } from "../api/analyzeApi.js";

// Bereitet die Vorschau-Prompts vor, indem sie die BPMN-Elemente extrahiert
// und die preparePrompt API-Funktion aufruft
export async function preparePromptPreview(modeler) { 
  const { xml } = await modeler.saveXML({ format: true });
  const elements = extractFromXml(xml);

  const response = await preparePrompt(elements); // calls backend /api/preview

  const preview =
    `[PREVIEW – SYSTEM PROMPT]\n` +
    `${response.systemPrompt ?? ""}\n\n` +
    `[PREVIEW – USER PROMPT]\n` +
    `${response.userPrompt ?? ""}`;

  return { preview, elements, response };
}
