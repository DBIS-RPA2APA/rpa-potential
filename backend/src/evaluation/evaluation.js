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
import {
  calculateEvaluationReportSummary,
  getTestCaseReport,
} from "./metrics.js";

export async function evaluateDataset(evaluationConfig, llmProps = {}) {
  const { datasetName, testCases, numRepetitions } = evaluationConfig;

  let totalTruePositives = 0;
  let totalFalsePositives = 0;
  let totalFalseNegatives = 0;
  let totalTrueNegatives = 0;

  const results = [];
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

    console.log(criticalElements);

    // 4) Build TestCaseReport
    const TestCaseReport = getTestCaseReport(
      criticalElements,
      testCase,
      numRepetitions,
    );

    const totalElements = testCase.elements.length;

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

  const evaluationReportSummary = calculateEvaluationReportSummary(
    totalFalseNegatives,
    totalFalsePositives,
    totalTrueNegatives,
    totalTruePositives,
  );

  return {
    datasetName,
    testCaseReports: results,
    metadata: evaluationReportSummary,
  };
}
