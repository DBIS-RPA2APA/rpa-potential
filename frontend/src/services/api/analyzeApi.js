// Service function who communicates with the backend API
// task is to send the BPMN elements for analysis to the backend

// local development: backend on port 8080; Docker: VITE_API_BASE="" (same origin, nginx proxies /api)
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function analyzeElements(elements, llmProps = {}) {
  return postJson("/api/analyze", { elements, llmProps });
}
export async function extractBpmnElements(xml) {
  return postJson("/api/extract", { xml });
}
export async function evaluateDataset(evaluationConfig, llmProps = {}) {
  return postJson("/api/evaluate", { evaluationConfig, llmProps });
}
// progress of a running evaluation (id is sent as evaluationConfig.evaluationId)
export async function getEvaluationProgress(evaluationId) {
  return getJson(`/api/evaluate/progress/${encodeURIComponent(evaluationId)}`);
}
export async function getPromptPreview(elements) {
  return postJson("/api/preview", { elements });
}

export async function chatMessage(message, llmProps = {}) {
  return postJson("/api/chat", { message, llmProps });
}
export async function saveEvaluationHistory(evaluationResultObject) {
  return postJson("/api/evaluationHistory", evaluationResultObject);
}

export async function getDatasets() {
  return getJson("/api/datasets");
}

export async function getEvaluationHistory() {
  return getJson("/api/evaluationHistory");
}

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
  });
  const text = await res.text();

  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    throw new Error(
      parsed?.error ? parsed.error : `Backend error ${res.status}: ${text}`,
    );
  }
  return parsed;
}

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    throw new Error(
      parsed?.error ? parsed.error : `Backend error ${res.status}: ${text}`,
    );
  }

  return parsed;
}
