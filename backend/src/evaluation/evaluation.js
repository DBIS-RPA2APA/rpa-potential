// Runs the classification pipeline repeatedly over a dataset and compares the
// results with the ground truth (<model>.labels.json).
//
// Options (evaluationConfig or environment variables):
//   inputMode                    "full" | "labelsOnly" | "structureOnly"
//                                (EVAL_INPUT_MODE, default "full")
//   excludeSubprocessActivities  true: activities nested inside a subprocess
//                                are not scored (EVAL_EXCLUDE_SUBPROCESS_ACTIVITIES,
//                                default false). Subprocess elements themselves
//                                are never extracted and therefore never scored.
//
// Every evaluation is additionally written to ./src/evaluation/evaluation-runs/
// including the raw LLM response metadata and the validation diagnostics.
import crypto from "crypto";
import fs from "fs";
import { execSync } from "child_process";
import { buildSystemPrompt, buildUserPrompt } from "../llm/LlmPrompt.js";
import { callStructuredLlm, getModelRouting } from "../llm/llmClient.js";
import { normalizeAndValidate, ACTIVITY_TYPES } from "../llm/Validation.js";
import {
  loadDatasetConfig,
  loadDatasetTestCases,
  resolveDataset,
} from "../evaluation/loadDataset.js";
import {
  calculateEvaluationReportSummary,
  getTestCaseReport,
  totalRunEvaluationSummary,
} from "./metrics.js";

const RUN_LOG_FOLDER = "./src/evaluation/evaluation-runs";

// onProgress (optional) is called after every evaluated BPMN model with
// { done, total, repetition, numRepetitions, bpmnModel, error }.
export async function evaluateDataset(
  evaluationConfig,
  llmProps = {},
  onProgress = () => {},
) {
  // effective dataset name (in Docker: the single mounted dataset)
  const datasetName = resolveDataset(evaluationConfig.datasetName).name;
  const numRepetitions = Number(evaluationConfig.numRepetitions) || 1;
  const datasetConfig = loadDatasetConfig(evaluationConfig.datasetName);
  const options = {
    inputMode:
      evaluationConfig.inputMode ??
      datasetConfig.inputMode ??
      process.env.EVAL_INPUT_MODE ??
      "full",
    excludeSubprocessActivities:
      evaluationConfig.excludeSubprocessActivities ??
      datasetConfig.excludeSubprocessActivities ??
      process.env.EVAL_EXCLUDE_SUBPROCESS_ACTIVITIES === "true",
  };

  const testCases = loadDatasetTestCases(evaluationConfig.datasetName);
  if (testCases.length === 0) {
    throw new Error(`No data test cases found: ${datasetName}`);
  }

  const systemPrompt = buildSystemPrompt();
  const evaluationMeta = {
    startedAt: new Date().toISOString(),
    finishedAt: null,
    numRepetitions,
    ...options,
    systemPromptSha256: sha256(systemPrompt),
    gitCommit: currentGitCommit(),
    llmProps: withoutSecrets(llmProps),
    // provider routing and extra request parameters from providers.json
    modelRouting: getModelRouting(
      llmProps.modelName || process.env.DEFAULT_MODEL || "openai/gpt-4o-mini",
    ),
  };

  // visible check in the backend terminal which model is actually evaluated
  console.log(
    `=== EVALUATION START: model=${llmProps.modelName ?? "(default)"}, dataset=${datasetName}, ` +
      `models=${testCases.length}, repetitions=${numRepetitions}, inputMode=${options.inputMode} ===`,
  );

  const total = testCases.length * numRepetitions;
  let done = 0;
  onProgress({ done, total, repetition: 1, numRepetitions });

  const totalRunResult = [];
  for (let i = 0; i < numRepetitions; i++) {
    totalRunResult.push(
      await evaluateSingleRun(
        datasetName,
        testCases,
        llmProps,
        i + 1,
        systemPrompt,
        options,
        (bpmnModel, error) => {
          done += 1;
          onProgress({
            done,
            total,
            repetition: i + 1,
            numRepetitions,
            bpmnModel,
            error,
          });
        },
      ),
    );
  }

  // accuracy, precision, recall, f1Score, failed, passed, error, total of ALL runs
  const totalMetrics = totalRunEvaluationSummary(totalRunResult);
  evaluationMeta.finishedAt = new Date().toISOString();

  writeRunLog({ datasetName, evaluationMeta, totalMetrics, totalRunResult });

  return {
    datasetName,
    evaluationMeta,
    testCases,
    totalMetrics,
    totalRunResult,
  };
}

async function evaluateSingleRun(
  datasetName,
  testCases,
  llmProps,
  runId,
  systemPrompt,
  options,
  onTestCaseDone = () => {},
) {
  let totalTruePositives = 0;
  let totalFalsePositives = 0;
  let totalFalseNegatives = 0;
  let totalTrueNegatives = 0;

  const results = [];

  for (const testCase of testCases) {
    // Activities that are scored in this evaluation
    const evaluatedIds = new Set(
      testCase.elements
        .filter((el) => ACTIVITY_TYPES.includes(el.type))
        .filter(
          (el) => !(options.excludeSubprocessActivities && el.parentSubProcessId),
        )
        .map((el) => el.id),
    );

    // Ground truth restricted to the scored activities. Labels for other IDs
    // (e.g. subprocess elements) are ignored and reported.
    const ignoredLabelIds = testCase.expectedValues
      .map((ev) => ev.id)
      .filter((id) => !evaluatedIds.has(id));
    const scopedTestCase = {
      ...testCase,
      expectedValues: testCase.expectedValues.filter((ev) =>
        evaluatedIds.has(ev.id),
      ),
    };

    const userPrompt = buildUserPrompt(testCase.elements, {
      inputMode: options.inputMode,
    });

    let report;
    try {
      const { result, retries, raw, failedAttempts } = await callStructuredLlm(
        { systemPrompt, userPrompt, llmProps },
      );
      const parsed = normalizeAndValidate(result, testCase.elements);
      const criticalElements = parsed.criticalElements.filter((el) =>
        evaluatedIds.has(el.id),
      );

      report = getTestCaseReport(criticalElements, scopedTestCase, retries);
      report.assessedActivities = parsed.assessedActivities;
      report.diagnostics = {
        ...parsed.diagnostics,
        ignoredLabelIds,
        failedAttempts,
      };
      report.llmResponse = { ...raw, parsed: result };
    } catch (error) {
      // No valid response after all retries: the BPMN model counts as "Error"
      // in the pass rate, and no activity counts as predicted automatable.
      console.error(`Test case "${testCase.name}" failed:`, error.message);
      report = getTestCaseReport([], scopedTestCase, null);
      report.isSuccessful = null;
      report.error = error.message;
      report.diagnostics = {
        ignoredLabelIds,
        failedAttempts: error.failedAttempts ?? [],
      };
    }

    totalFalseNegatives += report.falseNegativeIds.length;
    totalFalsePositives += report.falsePositiveIds.length;
    totalTruePositives += report.correctActivityIds.length;
    totalTrueNegatives +=
      evaluatedIds.size -
      scopedTestCase.expectedValues.length -
      report.falsePositiveIds.length;

    results.push(report);
    console.log(
      `--- progress: repetition ${runId}, BPMN model ${results.length}/${testCases.length} (${testCase.name})` +
        (report.error ? " -> ERROR" : ""),
    );
    onTestCaseDone(testCase.name, Boolean(report.error));
  }

  const evaluationReportSummary = calculateEvaluationReportSummary(
    totalFalseNegatives,
    totalFalsePositives,
    totalTrueNegatives,
    totalTruePositives,
  );

  return {
    datasetName,
    runId,
    testCaseReports: results,
    metadata: evaluationReportSummary,
  };
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function currentGitCommit() {
  if (process.env.GIT_COMMIT) return process.env.GIT_COMMIT;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function withoutSecrets(llmProps) {
  const { apiKey, ...rest } = llmProps ?? {};
  return rest;
}

function writeRunLog(evaluation) {
  try {
    if (!fs.existsSync(RUN_LOG_FOLDER)) {
      fs.mkdirSync(RUN_LOG_FOLDER, { recursive: true });
    }
    const model = (evaluation.evaluationMeta.llmProps.modelName ?? "model")
      .replaceAll("/", "-");
    const stamp = evaluation.evaluationMeta.startedAt.replaceAll(":", "-");
    const file = `${RUN_LOG_FOLDER}/run-${evaluation.datasetName}-${model}-${evaluation.evaluationMeta.inputMode}-${stamp}.json`;
    fs.writeFileSync(file, JSON.stringify(evaluation, null, 2));
  } catch (error) {
    console.error("Could not write evaluation run log:", error.message);
  }
}
