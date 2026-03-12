// hier wird die API-Funktion definiert, die das Frontend nutzt,
// um mit dem Backend zu kommunizieren
// task ist es, die BPMN-Elemente zur Analyse an das Backend zu schicken,
// antwort holen und ergebnis zurückgeben an das Frontend

const API_BASE = "http://localhost:8080";

export async function analyzeElements(elements, llmProps = {}) {
  return postJson("/api/analyze", { elements, llmProps });
}

export async function getPromptPreview(elements) {
  return postJson("/api/preview", { elements });
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
