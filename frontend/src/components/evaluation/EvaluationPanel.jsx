import { useState, useMemo, useRef, useEffect } from "react";
import Button from "../../ui/button";
import "../../styles/index.css";
import EvaluationResult from "./EvaluationResult";
import {
  getAvailableDatasets,
  loadDatasetTestCases,
} from "../../services/evaluation/loadDataset";
import { evaluateDataset } from "../../services/api/analyzeApi";

const EvaluationPanel = ({ numRepetitions, setNumRepetitions, llmProps }) => {
  const availableDatasets = useMemo(() => getAvailableDatasets(), []);
  const [dataset, setDataset] = useState(availableDatasets[0] || "");
  const [evaluationData, setEvaluationData] = useState(null);
  const [showEvaluationResult, setShowEvaluationResult] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const [evaluationStatus, setEvaluationStatus] = useState("available"); // Status zu speichern
  const [progress, setProgress] = useState(0); // progress (weite der Bar) zu speichern
  const [evaluationError, setEvaluationError] = useState(null); // Error-Message zu speichern

  const progressIntervalRef = useRef(null);

  useEffect(() => {
    // cleanup function to clear interval on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const statusConfig = {
    available: {
      label: "available",
      textColor: "text-slate-700",
      barColor: "bg-slate-700",
    },
    running: {
      label: "running",
      textColor: "text-cyan-700",
      barColor: "bg-cyan-700",
    },
    finished: {
      label: "finished",
      textColor: "text-emerald-700",
      barColor: "bg-emerald-700",
    },
    error: {
      label: "error",
      textColor: "text-red-700",
      barColor: "bg-red-700",
    },
  };

  const currentStatus = // Change the UI depending on what happens and what the status is
    statusConfig[evaluationStatus] || statusConfig.available;

  const startProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgress(3);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 97) return prev;

        const remaining = 97 - prev;
        const increment = Math.max(1, remaining * 0.1); // faster at first, then slower
        return Math.min(97, prev + increment);
      });
    }, 1000);
  };

  const stopProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleEvaluation = async () => {
    // returns array of test cases with id, name, bpmnXml, elements, expectedValues
    const cases = loadDatasetTestCases(dataset);
    console.log("Loaded test cases:", cases);
    setTestCases(cases);
    setEvaluationError("");

    const evaluationConfig = {
      datasetName: dataset,
      testCases: cases,
      numRepetitions,
      evaluationEndpoint: "/api/evaluate",
    };
    if (cases.length === 0) {
      console.warn("No test cases found for dataset:", dataset);
      setEvaluationStatus("error");
      setProgress(0);
      setEvaluationError("No test cases found for the selected dataset.");
      return;
    }
    setEvaluationStatus("running");
    startProgressSimulation();

    try {
      const result = await evaluateDataset(evaluationConfig, llmProps);
      console.log("Evaluation result:", result);

      stopProgressSimulation();
      setProgress(100);
      setEvaluationStatus("finished");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setEvaluationData(result);
      console.log("Summary:", summary);
      setShowEvaluationResult(true);
    } catch (error) {
      console.error("Evaluation failed:", error);
      stopProgressSimulation();
      setEvaluationStatus("error");
      setProgress(0);
      setEvaluationError("An error occurred during evaluation.");
    }
  };

  const summary = evaluationData ? createSummary(evaluationData) : null;
  function createSummary(evaluationData) {
    const passedCount = evaluationData.testCaseReports.filter(
      (report) => report.isSuccessful,
    ).length;
    const totalCount = evaluationData.testCaseReports.length;
    const failedCount = totalCount - passedCount;
    const errorCount = evaluationData.testCaseReports.filter(
      (report) => report.error,
    ).length;
    const percent = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

    return {
      total: totalCount,
      passed: passedCount,
      failed: failedCount,
      error: errorCount,
      percent: percent.toFixed(2),
    };
  }

  return (
    <>
      <div className="h-full min-h-0 flex flex-col p-4">
        {/* Evaluation Settings*/}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Evaluation Settings
          </h2>
          <p className="text-xs text-slate-500">
            Choose your evaluation datasets and configure the parameters for the
            evaluation.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pl-1 pr-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Number of Repetitions
            </label>
            <input
              type="number"
              value={numRepetitions}
              onChange={(e) => setNumRepetitions(Number(e.target.value))}
              className="w-full rounded border border-slate-400 px-3 py-2 text-slate-900"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Select Datasets
            </label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full rounded border  text-slate-900"
            >
              {availableDatasets.map((ds) => (
                <option key={ds} value={ds}>
                  {ds}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <Button
              color="primary"
              size="width"
              onClick={handleEvaluation}
              disabled={evaluationStatus === "running"}
            >
              Apply Evaluation
            </Button>
          </div>
        </div>

        <div className="mt-auto space-y-5">
          <div className="mt-15 mb-2">
            <p className="text-sm text-slate-500">
              Current Evaluation Status:{" "}
              <span className={`font-bold ${currentStatus.textColor}`}>
                {currentStatus.label}
              </span>
            </p>
          </div>
          <div className="w-full mb-1 bg-slate-300 rounded-full h-2">
            <div
              className={`${currentStatus.barColor} h-2 rounded-full w-1/2 transition-all duration-500 ease-in-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-900">{Math.round(progress)}%</p>
          {evaluationError && (
            <p className="text-sm text-red-700">{evaluationError}</p>
          )}
          {/* automatische Navigation zu /evaluation/results/:runId*/}
          <div className="mt-auto">
            <Button
              size="width"
              disabled={!evaluationData || evaluationStatus !== "finished"}
              onClick={() => setShowEvaluationResult(true) && evaluationData}
            >
              Open Results
            </Button>
          </div>
        </div>
      </div>
      {showEvaluationResult && evaluationData && (
        <EvaluationResult
          onClose={() => setShowEvaluationResult(false)}
          llmProps={llmProps}
          evaluationConfig={{
            dataset,
            numRepetitions,
            testCases,
            defaultEvaluationEndpoint: "/api/evaluate",
            timestamp: new Date().toISOString(),
          }}
          testCaseReports={evaluationData.testCaseReports ?? []}
          summary={summary}
          metadata={evaluationData.metadata}
        />
      )}
    </>
  );
};
export default EvaluationPanel;
/*
evaluationData =
{
  datasetName: "Dataset1",
  testCaseReports: [
    {
        testCaseID: 1,
        testCaseName: "...",
        datasetId: "Dataset1",
        imageSrc: null,
        correctActivityIds: [...],
        falsePositiveIds: [...],
        falseNegativeIds: [...],
        expectedNamesWithIds: [...],
        actualNamesWithIds: [...],
        isSuccessful: true,
        result: [...],
        amountOfRetries: 0
    },
    {
      ...
    }
  ]
  metadata: {
  precision: 0.75,
  recall: 0.88,
  f1Score: 0.80,
  accuracy: 0.73
  }
}
*/
