import React, { useState, useMemo } from "react";
import Button from "../../ui/button";
import "../../styles/index.css";
import EvaluationResult from "./EvaluationResult";
import {
  getAvailableDatasets,
  loadDatasetTestCases,
} from "../../services/evaluation/loadDataset";
import { evaluateDataset } from "../../services/api/analyzeApi";

const EvaluationPanel = ({
  numRepetitions,
  setNumRepetitions,
  maxConcurrentRequests,
  setMaxConcurrentRequests,
  dataset,
  setDataset,
  llmProps,
}) => {
  const [showEvaluationResult, setShowEvaluationResult] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const availableDatasets = useMemo(() => getAvailableDatasets(), []);

  const handleEvaluation = async () => {
    // returns array of test cases with id, name, bpmnXml, elements, expectedValues
    const cases = loadDatasetTestCases(dataset);
    console.log("Loaded test cases:", cases);
    setTestCases(cases);
    // trigger evaluation process here (e.g., call API to start evaluation with config)
    const evaluationConfig = {
      datasetName: dataset,
      testCases: cases,
      numRepetitions,
      maxConcurrent: maxConcurrentRequests,
      timestamp: new Date().toISOString(),
      evaluationEndpoint: "/api/evaluate",
    };
    if (cases.length === 0) {
      console.warn("No test cases found for dataset:", dataset);
      return;
    }
    try {
      const result = await evaluateDataset(evaluationConfig, llmProps);
      console.log("Evaluation result:", result);
      setShowEvaluationResult(true);
    } catch (error) {
      console.error("Evaluation failed:", error);
    }
    setShowEvaluationResult(true);
  };

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

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Max Concurrent LLM Requests
            </label>
            <input
              type="number"
              value={maxConcurrentRequests}
              onChange={(e) => setMaxConcurrentRequests(Number(e.target.value))}
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
            <Button color="primary" size="width" onClick={handleEvaluation}>
              Apply Evaluation
            </Button>
          </div>
        </div>

        <div className="mt-auto space-y-5">
          <div className="mt-15 mb-2">
            <p className="text-sm text-slate-500">
              Current Evaluation Status:{" "}
              <span className="font-medium text-slate-900">running</span>
            </p>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-2">
            <div className="bg-cyan-800 h-2 rounded-full w-1/2"></div>
          </div>
          {/* automatische Navigation zu /evaluation/results/:runId*/}
          <div className="mt-auto">
            <Button size="width" onClick={() => setShowEvaluationResult(true)}>
              Open Results
            </Button>
          </div>
        </div>
      </div>
      {showEvaluationResult && (
        <EvaluationResult
          onClose={() => setShowEvaluationResult(false)}
          llmProps={llmProps}
          evaluationConfig={{
            dataset,
            numRepetitions,
            testCases,
          }}
        />
      )}
    </>
  );
};
export default EvaluationPanel;
