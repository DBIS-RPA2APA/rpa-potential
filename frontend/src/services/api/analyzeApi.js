export async function analyzeElements(elements) {
  const res = await fetch("http://localhost:8080/api/analyze", {
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
