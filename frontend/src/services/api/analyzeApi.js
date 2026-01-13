// hier wird die API-Funktion definiert, die das Frontend nutzt, 
// um mit dem Backend zu kommunizieren
// task ist es, die BPMN-Elemente zur Analyse an das Backend zu schicken, 
// antwort holen und ergebnis zurückgeben an das Frontend

export async function analyzeElements(elements) {
  const res = await fetch("http://localhost:8080/api/analyze", { // Route: exakt wie in Express definiert
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ elements }),
  }); // frontend und backend verbunden über fetch API

  const text = await res.text(); // roher Text der Antwort

  if (!res.ok) { // http Status prüfen
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  return JSON.parse(text); 
}

export async function preparePrompt(elements){
  const res = await fetch("http://localhost:8080/api/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ elements }),
  });   

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Backend error ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}