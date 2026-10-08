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
import fs from "fs";

const DEFAULT_SESSION_ID = "default-session";

// One entry per activity of the BPMN model (see OUTPUT in LlmPrompt.js)
const BpmnAnalysisResult = z.object({
  activities: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      automatable: z.boolean(),
      criteria: z.array(z.number().int().min(1).max(9)),
      reason: z.string().nullable(),
    }),
  ),
});

// Optional OpenRouter provider routing per model, e.g.
// { "qwen/qwen3-vl-32b-instruct": { "order": ["<provider>"], "allow_fallbacks": false, "quantizations": ["bf16"] } }
// See https://openrouter.ai/docs (provider routing).
const PROVIDER_ROUTING = loadProviderRouting();

function loadProviderRouting() {
  try {
    const file = new URL("./providers.json", import.meta.url);
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};
  } catch (error) {
    console.warn("Could not read providers.json:", error.message);
    return {};
  }
}

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
  if (
    llmProps.seed !== undefined &&
    llmProps.seed !== null &&
    llmProps.seed !== ""
  ) {
    // the API expects an integer seed (the frontend stores it as a string)
    const seed = Number(llmProps.seed);
    if (!Number.isInteger(seed)) {
      throw new Error(`seed must be an integer, got "${llmProps.seed}"`);
    }
    modelConfig.seed = seed;
  }
  const provider = llmProps.provider ?? PROVIDER_ROUTING[modelConfig.model];
  if (provider) {
    modelConfig.modelKwargs = { provider };
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
// Returns { result, retries, raw, failedAttempts }.
// raw: metadata of the raw model response (generation ID, model, usage, ...)
// so that provider and model version can be traced afterwards.
export async function callStructuredLlm({
  systemPrompt,
  userPrompt,
  llmProps = {},
  maxRetries = 3,
}) {
  const config = buildModelConfig(llmProps);
  const model = new ChatOpenAI(config);
  // with Structured Output, we can define the expected structure with Zod (BpmnAnalysisResult)
  // includeRaw: keep the raw message; `parsed` is null if parsing failed
  const structuredModel = model.withStructuredOutput(BpmnAnalysisResult, {
    includeRaw: true,
  });

  const failedAttempts = [];
  let lastError = null;
  let retryPrompt = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const messages = [
        ["system", "{systemPrompt}"],
        ["user", "{userPrompt}"],
      ];
      // the retry hint is only sent after a failed attempt
      if (retryPrompt) messages.push(["system", "{retryPrompt}"]);
      const prompt = ChatPromptTemplate.fromMessages(messages);
      const chain = prompt.pipe(structuredModel);

      const output = await chain.invoke(
        retryPrompt
          ? { systemPrompt, userPrompt, retryPrompt }
          : { systemPrompt, userPrompt },
      );
      if (!output?.parsed) {
        throw new Error("Structured output could not be parsed");
      }
      const retries = i + 1;

      console.log(`=== LLM RESPONSE ANALYZE (${i + 1}/${maxRetries}) ===`);
      console.dir(output.parsed, { depth: null });
      return {
        result: output.parsed,
        retries,
        raw: summarizeRaw(output.raw),
        failedAttempts,
      };
    } catch (error) {
      lastError = error;
      // OpenRouter puts the provider's own error message into the error body
      // (error.metadata.raw / provider_name); keep it for diagnosis
      const details =
        error?.error ?? error?.response?.data ?? error?.cause?.error ?? null;
      failedAttempts.push({
        attempt: i + 1,
        error: error.message,
        status: error?.status ?? null,
        details,
      });
      console.warn(
        `Retry ${i + 1}/${maxRetries} failed:`,
        error.message,
        details ? JSON.stringify(details) : "",
      );
      retryPrompt =
        "The previous response could not be parsed. Return only valid JSON that conforms to the required structure.";
    }
  }
  const error = lastError ?? new Error("Structured LLM call failed");
  error.failedAttempts = failedAttempts;
  throw error;
}

function summarizeRaw(raw) {
  if (!raw) return null;
  return {
    generationId: raw.id ?? raw.response_metadata?.id ?? null,
    model: raw.response_metadata?.model_name ?? raw.response_metadata?.model ?? null,
    finishReason: raw.response_metadata?.finish_reason ?? null,
    usage: raw.usage_metadata ?? raw.response_metadata?.tokenUsage ?? null,
    responseMetadata: raw.response_metadata ?? null,
    content: typeof raw.content === "string" ? raw.content : null,
    toolCalls: raw.tool_calls ?? null,
  };
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
