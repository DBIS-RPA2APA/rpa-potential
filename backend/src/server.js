import express from "express";
import cors from "cors";
import { analyze } from "./analyze.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { elements } = req.body;

    if (!Array.isArray(elements)) {
      return res.status(400).json({ error: "elements must be an array" });
    }

    const result = await analyze(elements);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
