/* eslint-disable react-hooks/static-components */
import Button from "../../ui/button";
import AccordionSection from "../../ui/AccordionSection";
import DiagramCard from "../../ui/DiagrammSection";
import ModelResultAccordion from "../../ui/ModelResultAccordion";
import BarPlot from "../../ui/Barplot";
import PieChart from "../../ui/PieChart";
import Radar from "../../ui/RadarChart/Radar";
import { LuDownload, LuBadgeInfo } from "react-icons/lu";

//import { LuChevronsDownU, LuFoldVertical } from "react-icons/lu"; //<LuChevronsDownUp /> <LuFoldVertical />

export function EvaluationResult({
  onClose,
  llmProps,
  evaluationConfig,
  testCaseReports,
  summary,
  metadata,
}) {
  const numTestCases = evaluationConfig?.testCases?.length;
  function SummaryStat({ value, label, valueColor = "text-slate-900" }) {
    return (
      <div className="flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
        <span className="text-sm text-slate-500 mt-1">{label}</span>
      </div>
    );
  }
  function ProgressMetric({
    value,
    label,
    percent,
    valueColor = "text-slate-900",
  }) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center mb-2">
          <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
          <span className="text-sm text-slate-500 mt-1">{label}</span>
        </div>

        <div className="w-full bg-slate-300 rounded-full h-2">
          <div
            className="bg-cyan-800 h-2 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="fixed inset-0 z-500 bg-black/40 flex items-center justify-center">
        <div className="w-full h-full bg-slate-100 p-6 overflow-y-auto space-y-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-slate-900">
              Evaluation Results
            </h3>
            <div className="flex gap-2">
              <Button
                color="primary"
                size="medium"
                icon={<LuDownload size={15} />}
              >
                Download BPMN
              </Button>
              <Button size="small" color="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
          {/* First Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left */}
            <div className="bg-white rounded-md  shadow p-4">
              <p className="text-md text-slate-500">
                Model:{" "}
                <span className="font-medium text-slate-900">
                  {llmProps?.modelName ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Temperature:{" "}
                <span className="font-medium text-slate-900">
                  {llmProps?.temperature ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Top-p-Value:{" "}
                <span className="font-medium text-slate-900">
                  {llmProps?.topP ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Dataset:{" "}
                <span className="font-medium text-slate-900">
                  {evaluationConfig?.dataset ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Total Test Cases:{" "}
                <span className="font-medium text-slate-900">
                  {numTestCases ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Default Evaluation Endpoint:{" "}
                <span className="font-medium text-slate-900">
                  {evaluationConfig?.defaultEvaluationEndpoint ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Total Runs:{" "}
                <span className="font-medium text-slate-900">
                  {evaluationConfig?.numRepetitions ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Seed:{" "}
                <span className="font-medium text-slate-900">
                  {llmProps?.seed ?? "-"}
                </span>
              </p>
              <p className="text-md text-slate-500">
                Timestamp:{" "}
                <span className="font-medium text-slate-900">
                  {evaluationConfig?.timestamp ?? "-"}
                </span>
              </p>
            </div>
            {/* Right */}
            <div className="grid grid-rows-2 gap-2">
              {/* Evaluation Summary */}
              <div className="bg-white rounded-md  shadow p-4">
                <p className="text-slate-900 text-lg font-semibold">
                  Evaluation Summary
                </p>
                <div className="grid grid-cols-4 gap-5 my-3">
                  <SummaryStat
                    value={summary?.passed ?? 0}
                    label="Passed"
                    valueColor="text-emerald-800"
                  />
                  <SummaryStat
                    value={summary?.failed ?? 0}
                    label="Failed"
                    valueColor="text-red-800"
                  />
                  <SummaryStat
                    value={summary?.error ?? 0}
                    label="Errors"
                    valueColor="text-orange-500"
                  />
                  <SummaryStat
                    value={summary?.total ?? 0}
                    label="Total"
                    valueColor="text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">
                      Success Rate
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {summary?.percent ?? "-"}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 g-slate-300 rounded-full h-2">
                    <div
                      className="bg-cyan-800 h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${summary?.percent ?? 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {/* Performance Metrics */}
              <div className="bg-white rounded-md shadow p-4">
                <p className="text-slate-900 text-lg font-semibold">
                  Performance Metrics
                </p>
                <div className="grid grid-cols-4 gap-7 mt-5">
                  <ProgressMetric
                    // Accuracy: Anteil der korrekt klassifizierten Elemente (TP + TN) / (TP + FP + FN + TN)
                    value={metadata?.accuracy}
                    label="Accuracy"
                    percent={
                      metadata?.accuracy
                        ? (metadata.accuracy * 100).toFixed(1)
                        : "0.0"
                    }
                    valueColor="text-rose-400"
                  />
                  <ProgressMetric
                    // Precision: Anteil korrekt identifizierter relevanter Elemente
                    // (TP / (TP + FP))
                    value={metadata?.precision}
                    label="Precision"
                    percent={
                      metadata?.precision
                        ? (metadata.precision * 100).toFixed(1)
                        : "0.0"
                    }
                    valueColor="text-violet-800"
                  />
                  <ProgressMetric
                    // Recall: Anteil relevanter Elemente, die korrekt identifiziert
                    //wurden (TP / (TP + FN))
                    value={metadata?.recall}
                    label="Recall"
                    percent={
                      metadata?.recall
                        ? (metadata.recall * 100).toFixed(1)
                        : "0.0"
                    }
                    valueColor="text-amber-400"
                  />
                  <ProgressMetric
                    // Mittelwert aus Präzision und Recall
                    value={metadata?.f1Score}
                    label="F1-Score"
                    percent={
                      metadata?.f1Score
                        ? (metadata.f1Score * 100).toFixed(1)
                        : "0.0"
                    }
                    valueColor="text-lime-500"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Second Row */}
          <AccordionSection title="Diagrams of results">
            <div className="grid grid-cols-2 xl:grid-cols-2 gap-4">
              <DiagramCard title="Test Results Distribution">
                {({ width, height }) => (
                  <PieChart
                    data={[
                      { name: "Passed", value: summary?.passed ?? 0 },
                      { name: "Failed", value: summary?.failed ?? 0 },
                    ]}
                    width={width}
                    height={height}
                  />
                )}
              </DiagramCard>
              <DiagramCard title="Performance Metrics Overview">
                {({ width, height }) => (
                  <Radar
                    data={[
                      { name: "Accuracy", value: metadata?.accuracy ?? 0 },
                      { name: "Precision", value: metadata?.precision ?? 0 },
                      { name: "Recall", value: metadata?.recall ?? 0 },
                      { name: "F1-Score", value: metadata?.f1Score ?? 0 },
                    ]}
                    width={width}
                    height={height}
                  />
                )}
              </DiagramCard>
              <DiagramCard title="Performance Metrics Comparison">
                {({ width, height }) => (
                  <BarPlot
                    data={[
                      { name: "Accuracy", value: metadata?.accuracy ?? 0 },
                      { name: "Precision", value: metadata?.precision ?? 0 },
                      { name: "Recall", value: metadata?.recall ?? 0 },
                      { name: "F1-Score", value: metadata?.f1Score ?? 0 },
                    ]}
                    width={width}
                    height={height}
                  />
                )}
              </DiagramCard>
              <DiagramCard title="Confusion Matrix Breakdown">
                {({ width, height }) => (
                  <BarPlot
                    data={[
                      {
                        name: "True Positives",
                        value: metadata?.totalTruePositives ?? 0,
                      },
                      {
                        name: "False Positives",
                        value: metadata?.totalFalsePositives ?? 0,
                      },
                      {
                        name: "False Negatives",
                        value: metadata?.totalFalseNegatives ?? 0,
                      },
                      {
                        name: "True Negatives",
                        value: metadata?.totalTrueNegatives ?? 0,
                      },
                    ]}
                    width={width}
                    height={height}
                  />
                )}
              </DiagramCard>
            </div>
          </AccordionSection>

          {/* Third Row */}
          <AccordionSection title="Results per model">
            <div className="grid grid-cols-1 gap-2">
              {testCaseReports.map((result) => (
                <ModelResultAccordion key={result.testCaseID} result={result} />
              ))}
            </div>
          </AccordionSection>
        </div>
      </div>
    </>
  );
}

export default EvaluationResult;
