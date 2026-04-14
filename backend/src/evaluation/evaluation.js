// build prompt here, LLM call, parse JSON
// return result for Metrics calculation and visualization
/*
returns 
data class EvaluationMetadataReport()
data class EvaluationReportSummary()
data class TestCaseReport()
*/
import { buildSystemPrompt, buildUserPrompt } from "./LlmPrompt.js";
import { callStructuredLlm } from "./llmClient.js";
import { normalizeAndValidate } from "./Validation.js";

export async function evaluateDataset(evaluationConfig, llmProps = {}) {
  const { datasetName, testCases, numRepetitions, maxConcurrent } =
    evaluationConfig;

  // For simplicity, we will just analyze each test case with the existing analyze function
  // In a real implementation, you would likely want to design a specific evaluation prompt and logic
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

    results.push({
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      criticalElements,
      expectedValues: testCase.expectedValues,
    });
  }

  return {
    datasetName,
    results,
  };
}
