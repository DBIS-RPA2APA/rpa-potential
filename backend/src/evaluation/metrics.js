/*
builds evaluation results an dtest case reports based on LLM response and test case data
data class EvaluationReportSummary(
val total: Int,
val passed: Int,
val failed: Int,
val error: Int,
val amountOfRetries: Int? = null,
val precision: Double,
val recall: Double,
val f1Score: Double,
val accuracy: Double,
val totalTruePositives: Int,
val totalFalsePositives: Int,
val totalFalseNegatives: Int,
val totalTrueNegatives: Int
)
*/
export function calculateEvaluationReportSummary(
  totalFalseNegatives,
  totalFalsePositives,
  totalTrueNegatives,
  totalTruePositives,
) {
  let precision = 0.0;
  let recall = 0.0;
  let f1Score = 0.0;
  let accuracy = 0.0;

  if (totalTruePositives + totalFalsePositives > 0) {
    precision = totalTruePositives / (totalTruePositives + totalFalsePositives);
  } else {
    precision = 0.0;
  }

  if (totalTruePositives + totalFalseNegatives > 0) {
    recall = totalTruePositives / (totalTruePositives + totalFalseNegatives);
  } else {
    recall = 0.0;
  }

  if (precision + recall > 0) {
    f1Score = (2 * (precision * recall)) / (precision + recall);
  } else {
    f1Score = 0.0;
  }

  if (
    totalTruePositives +
      totalFalsePositives +
      totalFalseNegatives +
      totalTrueNegatives >
    0
  ) {
    accuracy =
      (totalTruePositives + totalTrueNegatives) /
      (totalTruePositives +
        totalFalsePositives +
        totalFalseNegatives +
        totalTrueNegatives);
  } else {
    accuracy = 0.0;
  }
  return {
    precision: precision.toFixed(2),
    recall: recall.toFixed(2),
    f1Score: f1Score.toFixed(2),
    accuracy: accuracy.toFixed(2),
    totalFalseNegatives,
    totalFalsePositives,
    totalTrueNegatives,
    totalTruePositives,
  };
}

export function getTestCaseReport(criticalElements, testCase, numRepetitions) {
  const expectedIds = testCase.expectedValues.map((ev) => ev.id); // from dataset labels - Lösung
  const actualIds = criticalElements.map((el) => el.id); // from llm response

  const allIds = Array.from(new Set([...expectedIds, ...actualIds]));

  const TestCaseReport = {
    testCaseID: testCase.id,
    testCaseName: testCase.name,
    datasetId: testCase.datasetId,
    imageSrc: testCase.bpmnXml ?? null,
    correctActivityIds: criticalElements
      .filter((el) => expectedIds.includes(el.id))
      .map((el) => el.id),
    falsePositiveIds: actualIds.filter((id) => !expectedIds.includes(id)),
    falseNegativeIds: expectedIds.filter((id) => !actualIds.includes(id)),
    expectedNamesWithIds: testCase.expectedValues, // id, reason, score NAME!!!!!!
    actualNamesWithIds: criticalElements,
    isSuccessful:
      expectedIds.length === actualIds.length &&
      expectedIds.every((id) => actualIds.includes(id)),
    result: [...allIds].map((id) => {
      const expected = testCase.expectedValues.find((ev) => ev.id === id);
      const actual = criticalElements.find((el) => el.id === id);

      return {
        id,
        name: actual?.name ?? expected?.name ?? "Unknown",
        llmScore: actual ? actual.score : null,
        expectedScore: expected ? expected.score : null,
        reasoning:
          actual?.reason ?? expected?.reason ?? "No reasoning provided",
        status:
          expected && actual
            ? "correct"
            : expected
              ? "falseNegative"
              : "falsePositive",
      };
    }),
    amountOfRetries: numRepetitions - 1,
  };

  return TestCaseReport;
}
