import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyze } from "./analyze.js";
import { buildPreviewPrompt } from "./PreviewPrompt.js";

const app = express(); // Express-Server initialisieren

app.use(cors()); // CORS aktivieren, damit Frontend zugreifen kann
app.use(express.json({ limit: "5mb" })); // JSON-Body-Parsing aktivieren

console.log("OPENROUTER_API_KEY loaded:", !!process.env.OPENROUTER_API_KEY);
console.log("OPENROUTER_BASE_URL:", process.env.OPENROUTER_BASE_URL);
console.log("DEFAULT_MODEL:", process.env.DEFAULT_MODEL);

// Health-Check Endpoint, um zu prüfen, ob der Server läuft
// get wird beim Server verwendet für Anfragen
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ------- Analyse-Endpoint mit logischem API pfad -------
app.post("/api/analyze", async (req, res) => {
  try {
    const { elements, llmProps } = req.body; // ist inhalt der anfrage, also die BPMN-Elemente

    if (!Array.isArray(elements)) {
      return res.status(400).json({
        error: "elements must be an array",
        code: "INVALID_INPUT",
      });
    }

    const result = await analyze(elements, llmProps || {}); // baut prompt, ruft LLM auf, parst Antwort, await server wartet auf Ergebnis
    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});

// ------ for extract tasks Button preview for user -------
app.post("/api/preview", async (req, res) => {
  try {
    const { elements } = req.body; // ist inhalt der anfrage, also die BPMN-Elemente

    if (!Array.isArray(elements)) {
      return res
        .status(400)
        .json({ error: "elements must be an array", code: "INVALID_INPUT" });
    }

    const result = await buildPreviewPrompt(elements);
    console.log("Preview result:", result.systemPrompt, result.userPrompt);
    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
