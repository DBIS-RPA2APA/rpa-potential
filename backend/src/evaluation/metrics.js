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

export function totalRunEvaluationSummary(totalRunResult) {
  let accuracySum = 0.0;
  let precisionSum = 0.0;
  let recallSum = 0.0;
  let f1ScoreSum = 0.0;
  let failed = 0;
  let passed = 0;
  let error = 0;
  let total = 0;

  for (const runResult of totalRunResult) {
    accuracySum += Number(runResult.metadata.accuracy);
    precisionSum += Number(runResult.metadata.precision);
    recallSum += Number(runResult.metadata.recall);
    f1ScoreSum += Number(runResult.metadata.f1Score);

    for (const testCase of runResult.testCaseReports) {
      total += 1;
      if (testCase.isSuccessful === true) {
        passed += 1;
      } else if (testCase.isSuccessful === false) {
        failed += 1;
      } else {
        error += 1;
      }
    }
  }
  const totalRuns = totalRunResult.length || 1;
  const percent = total > 0 ? (passed / total) * 100 : 0;

  return {
    accuracy: (accuracySum / totalRuns).toFixed(2),
    precision: (precisionSum / totalRuns).toFixed(2),
    recall: (recallSum / totalRuns).toFixed(2),
    f1Score: (f1ScoreSum / totalRuns).toFixed(2),
    failed,
    passed,
    error,
    total,
    percent: percent.toFixed(2),
  };
}

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
  const expectedNamesWithIds = testCase.expectedValues.map((value) => {
    const element = testCase.elements.find((el) => el.id === value.id);
    return {
      ...value,
      name: element?.name ?? null,
    };
  });

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
    expectedNamesWithIds: expectedNamesWithIds, // id, reason, score NAME!!!!!!
    actualNamesWithIds: criticalElements,
    isSuccessful:
      expectedIds.length === actualIds.length &&
      expectedIds.every((id) => actualIds.includes(id)),
    result: [...allIds].map((id) => {
      const expected = expectedNamesWithIds.find((ev) => ev.id === id);
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
    amountOfRetries: numRepetitions,
  };
  return TestCaseReport;
}
