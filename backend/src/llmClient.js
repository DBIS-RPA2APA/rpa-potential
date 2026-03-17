// LLM call
// parse JSON
// return result
// Austauschbare Schnittstelle für verschiedene LLM-Anbieter

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
  const modelConfig = {
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
  };
  if (llmProps.seed !== undefined && llmProps.seed !== null) {
    modelConfig.seed = llmProps.seed;
  }
  const model = new ChatOpenAI(modelConfig);
  // with Structured Output, we can define the expected structure with Zod (BpmnAnalysisResult)
  const structuredModel = model.withStructuredOutput(BpmnAnalysisResult);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{systemPrompt}"],
    ["user", "{userPrompt}"],
  ]);

  const chain = prompt.pipe(structuredModel);

  const result = await chain.invoke({ systemPrompt, userPrompt });

  console.log("=== LLM RESPONSE ===");
  console.dir(result, { depth: null });
  return result;
}
