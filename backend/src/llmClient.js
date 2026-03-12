// LLM call
// parse JSON
// return result
// Austauschbare Schnittstelle für verschiedene LLM-Anbieter

// export async function callLlm({ elements, systemPrompt, userPrompt }) {
//   await new Promise((r) => setTimeout(r, 200));

//   const criticalElements = elements
//     .filter((_, idx) => idx % 2 === 0)
//     .map((e) => ({
//       id: e.id,
//       name: e.name ?? null,
//       reason: "Mock: flagged as critical for demo",
//     }));

//   console.log("Mock LLM called with prompts:\n", { systemPrompt, userPrompt });
//   return { criticalElements};
// }

import { ChatOpenAI } from "@langchain/openai"; //
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const BpmnAnalysisResult = z.object({
  criticalElements: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      reason: z.string().nullable(),
    }),
  ),
});

export async function callLlm({ systemPrompt, userPrompt, llmProps = {} }) {
  const model = new ChatOpenAI({
    model:
      llmProps.modelName || process.env.DEFAULT_MODEL || "openai/gpt-4o-mini",
    temperature: llmProps.temperature ?? 0.7,
    topP: llmProps.topP ?? 1,
    apiKey: llmProps.apiKey || process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL:
        llmProps.baseURL ||
        process.env.OPENROUTER_BASE_URL ||
        "https://openrouter.ai/api/v1",
    },
  });
  const structuredModel = model.withStructuredOutput(BpmnAnalysisResult);

  //const chain = prompt.pipe(structuredModel); // verbindet Prompt mit Modell, damit wir strukturierte Ausgabe bekommen

  const result = await structuredModel.invoke([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  console.log("=== LLM RESPONSE ===");
  console.dir(result, { depth: null });
  return result;
}
