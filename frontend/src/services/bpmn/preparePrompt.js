import { extractFromXml } from "./extractFromXml.js";
import { getPromptPreview } from "../api/analyzeApi.js";


// Bereitet die Vorschau-Prompts vor, indem sie die BPMN-Elemente extrahiert
// und die preparePrompt API-Funktion aufruft
export async function preparePromptPreview(modeler) { 
  const { xml } = await modeler.saveXML({ format: true });
  const elements = extractFromXml(xml);

  const response = await getPromptPreview(elements); // calls backend /api/preview

  const previewText =
    `[PREVIEW – SYSTEM PROMPT]\n` +
    `${response.systemPrompt ?? ""}\n\n` +
    `[PREVIEW – USER PROMPT]\n` +
    `${response.userPrompt ?? ""}`;

  return { previewText, elements, response };
}


