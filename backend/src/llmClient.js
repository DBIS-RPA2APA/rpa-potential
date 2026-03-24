// LLM call
// parse JSON
// return result
// Austauschbare Schnittstelle für verschiedene LLM-Anbieter

import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { z } from "zod";

const DEFAULT_SESSION_ID = "default-session";

const BpmnAnalysisResult = z.object({
  criticalElements: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      score: z.array(z.number().int().min(1).max(9)).min(1),
      reason: z.string().nullable(),
    }),
  ),
});

// A list of messages stored in historyStore
// addMessages(…),getMessages(), clear(),…
// --- historyStore(sessionID, InMemoryChatMessageHistory()) ---
// InMemoryChatMessageHistory { messages: [ HumanMessage, AIMessage, HumanMessage, AIMessage,…]}
const historyStore = new Map();

function getMessageHistory(sessionId) {
  if (!historyStore.has(sessionId)) {
    historyStore.set(sessionId, new InMemoryChatMessageHistory());
  }
  return historyStore.get(sessionId);
}

export function resetDefaultHistory() {
  historyStore.set(DEFAULT_SESSION_ID, new InMemoryChatMessageHistory());
}

export async function seedHistory(
  userPrompt,
  aiPrompt,
  sessionId = DEFAULT_SESSION_ID,
) {
  const history = getMessageHistory(sessionId);
  await history.addMessages([
    new HumanMessage(userPrompt),
    new AIMessage(aiPrompt),
  ]);
}

function buildModelConfig(llmProps = {}) {
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
  return modelConfig;
}

// --- prepare chain for Chat, without StructuredOutput ---
function chatChain(llmProps = {}) {
  const config = buildModelConfig(llmProps);
  const model = new ChatOpenAI(config);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{systemPrompt}"],
    new MessagesPlaceholder("history"),
    ["user", "{userPrompt}"],
  ]);

  const chain = prompt.pipe(model);

  return new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory,
    inputMessagesKey: "userPrompt",
    historyMessagesKey: "history",
  });
}

// --- start a llm for analysis  ---
export async function callStructuredLlm({
  systemPrompt,
  userPrompt,
  llmProps = {},
}) {
  const config = buildModelConfig(llmProps);
  const model = new ChatOpenAI(config);

  // with Structured Output, we can define the expected structure with Zod (BpmnAnalysisResult)
  const structuredModel = model.withStructuredOutput(BpmnAnalysisResult);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "{systemPrompt}"],
    ["user", "{userPrompt}"],
  ]);

  const chain = prompt.pipe(structuredModel);

  const result = await chain.invoke({ systemPrompt, userPrompt });

  console.log("=== LLM RESPONSE ANALYZE ===");
  console.dir(result, { depth: null });
  return result;
}

// --- start llm for chat using same sessionId that was used for analysis ---
export async function callChatLlm({
  systemPrompt,
  userPrompt,
  llmProps = {},
  sessionId = DEFAULT_SESSION_ID,
}) {
  const chainWithHistory = chatChain(llmProps);

  const result = await chainWithHistory.invoke(
    { systemPrompt, userPrompt },
    { configurable: { sessionId } },
  );

  console.log("=== LLM RESPONSE CHAT ===");
  console.dir(result, { depth: null });
  return result;
}
