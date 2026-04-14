// Service function who communicates with the backend API
// task is to send the BPMN elements for analysis to the backend

const API_BASE = "http://localhost:8080";

export async function analyzeElements(elements, llmProps = {}) {
  return postJson("/api/analyze", { elements, llmProps });
}
export async function evaluateDataset(evaluationConfig, llmProps = {}) {
  return postJson("/api/evaluate", { evaluationConfig, llmProps });
}
export async function getPromptPreview(elements) {
  return postJson("/api/preview", { elements });
}

export async function chatMessage(message, llmProps = {}) {
  return postJson("/api/chat", { message, llmProps });
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
