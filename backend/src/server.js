import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyze } from "./llm/analyze.js";
import { evaluateDataset } from "./evaluation/evaluation.js";
import { chat } from "./llm/chat.js";
import { buildPreviewPrompt } from "./llm/PreviewPrompt.js";
import { saveEvaluation, getAllEvaluations } from "./evaluation/history.js";
import { extractFromXml } from "./bpmn/extractFromXml.js";
import { listDatasets } from "./evaluation/loadDataset.js";
import {
  startProgress,
  updateProgress,
  finishProgress,
  getProgress,
} from "./evaluation/progress.js";

const app = express(); // Express-Server initialisieren

app.use(cors()); // Enable CORS so that the frontend can access it
// evaluation results of larger datasets (e.g. Dataset4: ~25 MB) are sent back
// to /api/evaluationHistory by the frontend, so the limit must be generous
app.use(express.json({ limit: "200mb" })); // JSON-Body-Parsing aktiv

console.log("OPENROUTER_API_KEY loaded:", !!process.env.OPENROUTER_API_KEY);
console.log("OPENROUTER_BASE_URL:", process.env.OPENROUTER_BASE_URL);
console.log("DEFAULT_MODEL:", process.env.DEFAULT_MODEL);

// Health-Check Endpoint, is server running
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ------- Extract endpoint with logical API path -------
app.post("/api/extract", async (req, res) => {
  try {
    const { xml } = req.body;

    if (!xml || typeof xml !== "string") {
      return res.status(400).json({
        error: "xml must be an string",
        code: "INVALID_INPUT",
      });
    }

    const result = await extractFromXml(xml);
    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});
// ------- Analytics endpoint with logical API path -------
app.post("/api/analyze", async (req, res) => {
  try {
    const { elements, llmProps } = req.body;

    if (!Array.isArray(elements)) {
      return res.status(400).json({
        error: "elements must be an array",
        code: "INVALID_INPUT",
      });
    }

    const result = await analyze(elements, llmProps || {});
    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});
// ------- Evaluation endpoint -------
app.post("/api/evaluate", async (req, res) => {
  let progressId;
  try {
    const { evaluationConfig, llmProps } = req.body;
    // the frontend generates the id and polls /api/evaluate/progress/:id
    progressId = evaluationConfig?.evaluationId;
    startProgress(progressId);

    const result = await evaluateDataset(
      evaluationConfig,
      llmProps || {},
      (state) => updateProgress(progressId, state),
    );
    finishProgress(progressId);
    res.json(result);
  } catch (err) {
    finishProgress(progressId, err.message);
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});
// ------- progress of a running evaluation -------
app.get("/api/evaluate/progress/:id", (req, res) => {
  const state = getProgress(req.params.id);
  if (!state) {
    return res.status(404).json({ error: "Unknown evaluation id" });
  }
  res.json(state);
});
// ------- available datasets (Docker: only the mounted dataset) -------
app.get("/api/datasets", (req, res) => {
  try {
    res.json(listDatasets());
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});
// ------- save Evaluation History -------
app.post("/api/evaluationHistory", async (req, res) => {
  try {
    const evaluation = req.body;
    const result = saveEvaluation(evaluation); // true

    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});
// ------- load Evaluation History -------
app.get("/api/evaluationHistory", async (req, res) => {
  try {
    const evaluations = getAllEvaluations();

    res.json(evaluations); // all evaluations that were saved in the folder
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Server error", code: "SERVER_ERROR" });
  }
});
// ------- chat messages -------
app.post("/api/chat", async (req, res) => {
  try {
    const { message, llmProps } = req.body;
    const result = await chat(message, llmProps || {});
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
    const { elements } = req.body;

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
