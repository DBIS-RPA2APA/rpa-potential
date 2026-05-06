// build prompt here, LLM call, parse JSON
// return result for Metrics calculation and visualization
/*
returns 
data class EvaluationMetadataReport()
data class EvaluationReportSummary()
data class TestCaseReport()
*/
import { buildSystemPrompt, buildUserPrompt } from "../LlmPrompt.js";
import { callStructuredLlm } from "../llmClient.js";
import { normalizeAndValidate } from "../Validation.js";
import { loadDatasetTestCases } from "../evaluation/loadDataset.js";
import {
  calculateEvaluationReportSummary,
  getTestCaseReport,
  totalRunEvaluationSummary,
} from "./metrics.js";

const BPMN_TASK_TYPES = new Set([
  "task",
  "userTask",
  "serviceTask",
  "manualTask",
  "scriptTask",
  "sendTask",
  "receiveTask",
]);
export async function evaluateDataset(evaluationConfig, llmProps = {}) {
  const { datasetName, numRepetitions } = evaluationConfig;
  const testCases = loadDatasetTestCases(datasetName);

  if (testCases.length === 0) {
    throw new Error(`No data test cases found: ${datasetName}`);
  }

  {
    /* totalRunResult: [
    {
      datasetName: "...",
      runId: 1,
      testCaseReports: ProModell:[testCaseId, name, xml, fpIds, fnIds, expected, acuatl,…],
      metadata: ProDatenset{precision, recall,…, totalFN, …}
    },
    {
      datasetName: "...",
      runId: 2,
      testCaseReports: [...],
      metadata: {...}
    }] */
  }
  const totalRunResult = [];

  for (let i = 0; i < numRepetitions; i++) {
    // return return { datasetName, runId, testCaseReports: results, metadata: evaluationReportSummary,};
    const resultTestCase = await evaluateSingleRun(
      datasetName,
      testCases,
      numRepetitions,
      llmProps,
      i + 1,
    );
    totalRunResult.push(resultTestCase);
  }

  //accurac, precision, racall, f1score, failed, passed, error, total, of ALL runs
  const totalMetrics = totalRunEvaluationSummary(totalRunResult);

  return {
    datasetName,
    testCases,
    totalMetrics,
    totalRunResult,
  };
}

async function evaluateSingleRun(
  datasetName,
  testCases,
  numRepetitions,
  llmProps = {},
  runId,
) {
  let totalTruePositives = 0;
  let totalFalsePositives = 0;
  let totalFalseNegatives = 0;
  let totalTrueNegatives = 0;

  const results = [];
  // --- loop through each BPMN in dataset ---
  // return-> TestCaseReport (testCaseId, name, xml, fpIds, fnIds, expected, acuatl,…)
  for (const testCase of testCases) {
    // 1) Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(testCase.elements);

    // 2) Call LLM, get raw response
    const rawLlmResponse = await callStructuredLlm({
      systemPrompt,
      userPrompt,
      llmProps,
    });
    // 3) Parse LLM response
    const parsed = normalizeAndValidate(rawLlmResponse, testCase.elements);
    const criticalElements = parsed.criticalElements;

    // 4) Build TestCaseReport (testCaseId, name, xml, fpIds, fnIds, expected, acuatl,…)
    const TestCaseReport = getTestCaseReport(
      criticalElements,
      testCase,
      numRepetitions,
    );

    const taskElements = testCase.elements.filter((el) =>
      BPMN_TASK_TYPES.has(el.type),
    );
    const totalElements = taskElements.length;

    totalFalseNegatives += TestCaseReport.falseNegativeIds.length;
    totalFalsePositives += TestCaseReport.falsePositiveIds.length;
    totalTruePositives += TestCaseReport.correctActivityIds.length;
    totalTrueNegatives +=
      totalElements -
      TestCaseReport.expectedNamesWithIds.length -
      TestCaseReport.falsePositiveIds.length;

    // FP -> falsePositiveIds.length
    // FN -> falseNegativeIds.length
    // TP -> correctActivityIds.length
    // TN -> elements - labeled elements - critical elements

    results.push(TestCaseReport);
  }

  // --- metrics are calculated based on dataset per ONE Run---
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
