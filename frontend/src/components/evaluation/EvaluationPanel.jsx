/* eslint-disable react-hooks/immutability */
import { useState, useRef, useEffect } from "react";
import Button from "../../ui/button";
import "../../styles/index.css";
import EvaluationResult from "./EvaluationResult";
import {
  evaluateDataset,
  getEvaluationHistory,
  saveEvaluationHistory,
} from "../../services/api/analyzeApi";

const EvaluationPanel = ({ llmProps }) => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [showEvaluationResult, setShowEvaluationResult] = useState(false);
  const [dataset, setDataset] = useState("Dataset0");
  const [numRepetitions, setNumRepetitions] = useState("");

  const [evaluationStatus, setEvaluationStatus] = useState("available"); // Status zu speichern
  const [progress, setProgress] = useState(0); // progress zu speichern
  const [evaluationError, setEvaluationError] = useState(null); // Error-Message zu speichern
  const [evaluationHistory, setEvaluationHistory] = useState([]);

  const progressIntervalRef = useRef(null);
  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    // cleanup function to clear progerss interval on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  async function loadHistory() {
    try {
      const data = await getEvaluationHistory();
      setEvaluationHistory(data);
    } catch (error) {
      console.error("Could not load hisotry", error);
      setEvaluationHistory([]);
    }
  }

  const statusConfig = {
    available: {
      label: "available",
      textColor: "text-[#FF6200]",
      barColor: "bg-[#FF6200]",
    },
    running: {
      label: "running",
      textColor: "text-[#10214D]",
      barColor: "bg-[#10214D]",
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
        const increment = Math.max(1, remaining * 0.05); // faster at first, then slower
        return Math.min(97, prev + increment);
      });
    }, 1800);
  };

  const stopProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleEvaluation = async () => {
    setEvaluationError("");

    const evaluationConfig = {
      datasetName: dataset,
      numRepetitions: numRepetitions || 1,
    };
    setEvaluationStatus("running");
    startProgressSimulation();

    try {
      const result = await evaluateDataset(evaluationConfig, llmProps);

      const evaluationResultObject = {
        datasetName: dataset,
        timestamp: new Date().toISOString(),
        numRepetitions: numRepetitions || 1,
        defaultEvaluationEndpoint: "/api/evaluate",
        llmProps: llmProps,
        testCases: result.testCases ?? [],
        totalMetrics: result.totalMetrics,
        totalRunResult: result.totalRunResult,
      };
      console.log("Evaluatjion Result:", evaluationResultObject);

      stopProgressSimulation();
      setProgress(100);
      setEvaluationStatus("finished");
      await new Promise((resolve) => setTimeout(resolve, 800));
      await saveEvaluationHistory(evaluationResultObject);
      await loadHistory();
      setEvaluationData(evaluationResultObject);
      setShowEvaluationResult(true);
    } catch (error) {
      console.error("Evaluation failed:", error);
      stopProgressSimulation();
      setEvaluationStatus("error");
      setProgress(0);
      setEvaluationError("An error occurred during evaluation.");
    }
  };
  function openResult(item) {
    setEvaluationData(item);
    setShowEvaluationResult(true);
  }
  return (
    <>
      <div className="h-full min-h-0 flex flex-col overflow-y-auto p-4 bg-[#DFE5F5]/60">
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

        <div className="shrink-0 space-y-5 px-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Number of Repetitions
            </label>
            <input
              type="number"
              min={1}
              max={5}
              placeholder="Set a number between 1 and 5"
              value={numRepetitions}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setNumRepetitions("");
                  return;
                }
                let num = Number(val);
                if (num < 1) num = 1;
                if (num > 5) num = 5;
                setNumRepetitions(num);
              }}
              className="w-full rounded-xl shadow-inner border-[#425176] border-2 px-3 py-2 text-slate-700 bg-white/30 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1 ">
              Select Datasets
            </label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="w-full rounded border  text-slate-900 bg-white/30 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
            >
              <option value="Dataset0">Dataset 0</option>
              <option value="Dataset1">Dataset 1</option>
              <option value="Dataset2">Dataset 2</option>
              <option value="Dataset3">Dataset 3</option>
            </select>
          </div>

          <div className="mt-5">
            <Button
              color="thirdary"
              size="width"
              onClick={handleEvaluation}
              disabled={evaluationStatus === "running"}
            >
              Apply Evaluation
            </Button>
          </div>
        </div>

        {/* Evaluation History */}
        <div className="my-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Evaluation History
          </h2>
          <p className="text-xs text-slate-500">
            View your last evaluation history and results.
          </p>
        </div>
        <div className="bg-[#97A8D5]/50 inset-shadow-sm inset-shadow-slate-500 rounded-3xl border p-3 overflow-y-auto max-h-56 md:max-h-80 shrink-0">
          {evaluationHistory.length === 0 && (
            <p className="text-md text-slate-500">No evaluations saved yet.</p>
          )}
          {evaluationHistory.map((item) => (
            <div
              key={`${item.datasetName}-${item.timestamp}`}
              className="rounded-2xl  border-md border-slate-300 bg-white px-4 py-3 mb-2 cursor-pointer hover:bg-[#10214D] hover:shadow-md hover:*:text-white transition"
              onClick={() => openResult(item)}
            >
              <p className="text-md font-medium text-slate-900 pb-2" id="title">
                {item.datasetName}
              </p>
              <p className="text-sm text-slate-500">{item.timestamp}</p>
              <p className="text-sm text-slate-500">
                Runs: {item.numRepetitions ?? 1}
              </p>
            </div>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="mt-auto pt-6 shrink-0  space-y-5">
          <div className="my-3">
            <p className="text-sm text-slate-500">
              Current Evaluation Status:{" "}
              <span className={`font-bold ${currentStatus.textColor}`}>
                {currentStatus.label}
              </span>
            </p>
          </div>
          <div className="w-full mb-1 bg-[#EFEFEF] rounded-full h-2">
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
              color="thirdary"
              size="width"
              disabled={!evaluationData || evaluationStatus !== "finished"}
              onClick={() => setShowEvaluationResult(true)}
            >
              Open Last Result
            </Button>
          </div>
        </div>
      </div>
      {showEvaluationResult && evaluationData && (
        <EvaluationResult
          onClose={() => setShowEvaluationResult(false)}
          llmProps={evaluationData.llmProps}
          evaluationConfig={{
            datasetName: evaluationData.datasetName,
            timestamp: evaluationData.timestamp,
            numRepetitions: evaluationData.numRepetitions,
            defaultEvaluationEndpoint: evaluationData.defaultEvaluationEndpoint,
            testCases: evaluationData.testCases,
          }}
          totalRunResult={evaluationData.totalRunResult ?? []}
          totalSummary={evaluationData.totalMetrics}
          metadata={evaluationData.totalMetrics}
          evaluationDataObject={evaluationData}
        />
      )}
    </>
  );
};
export default EvaluationPanel;
