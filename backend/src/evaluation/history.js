// --- Logic for the Evaluation History ---
// evaluation -> evaluationResultObject
import fs from "fs";

const historyFolder = "./src/evaluation/evaluation-history";

export function saveEvaluation(evaluation) {
  if (!fs.existsSync(historyFolder)) {
    fs.mkdirSync(historyFolder);
  }

  const safeTimestamp = evaluation.timestamp.replaceAll(":", "-");
  const fileName = `evaluation-result-${evaluation.datasetName}-${safeTimestamp}.json`;
  const filePath = `${historyFolder}/${fileName}`;

  const json = JSON.stringify(evaluation, null, 2);

  fs.writeFileSync(filePath, json);

  return {
    success: true,
  };
}

export function getAllEvaluations() {
  if (!fs.existsSync(historyFolder)) {
    fs.mkdirSync(historyFolder);
  }
  const files = fs.readdirSync(historyFolder);
  const evaluations = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = `${historyFolder}/${file}`;
      const content = fs.readFileSync(filePath, "utf-8");
      const evaluation = JSON.parse(content);
      evaluations.push(evaluation);
    }
  }
  evaluations.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return evaluations;
}
