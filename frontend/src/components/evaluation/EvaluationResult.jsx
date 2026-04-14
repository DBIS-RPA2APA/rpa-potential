/* eslint-disable react-hooks/static-components */
import Button from "../../ui/button";
import AccordionSection from "../../ui/AccordionSection";
import DiagramCard from "../../ui/DiagrammSection";
import ModelResultAccordion from "../../ui/ModelResultAccordion";
//import { LuChevronsDownU, LuFoldVertical } from "react-icons/lu"; //<LuChevronsDownUp /> <LuFoldVertical />

export function EvaluationResult({ onClose, llmProps, evaluationConfig }) {
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
    <div className="fixed inset-0 z-500 bg-black/40 flex items-center justify-center">
      <div className="w-full h-full bg-slate-100 p-6 overflow-y-auto space-y-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-semibold text-slate-900">
            Evaluation Results
          </h3>

          <Button size="small" color="secondary" onClick={onClose}>
            Close
          </Button>
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
                {evaluationConfig?.testcases ?? "-"}
              </span>
            </p>
            <p className="text-md text-slate-500">
              Default Evaluation Endpoint:{" "}
              <span className="font-medium text-slate-900">
                {llmProps?.defaultEvaluationEndpoint ?? "-"}
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
                  value={9}
                  label="Passed"
                  valueColor="text-emerald-800"
                />
                <SummaryStat
                  value={16}
                  label="Failed"
                  valueColor="text-red-800"
                />
                <SummaryStat
                  value={0}
                  label="Errors"
                  valueColor="text-orange-500"
                />
                <SummaryStat
                  value={25}
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
                    45%
                  </span>
                </div>
                <div className="w-full bg-slate-200 g-slate-300 rounded-full h-2">
                  <div
                    className="bg-cyan-800 h-2 rounded-full"
                    style={{ width: "45%" }}
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
                  value="0.735"
                  label="Accuracy"
                  percent={73.5}
                  valueColor="text-rose-400"
                />
                <ProgressMetric
                  value="0.746"
                  label="Precision"
                  percent={74.6}
                  valueColor="text-violet-800"
                />
                <ProgressMetric
                  value="0.880"
                  label="Recall"
                  percent={88.0}
                  valueColor="text-amber-400"
                />
                <ProgressMetric
                  value="0.808"
                  label="F1-Score"
                  percent={80.8}
                  valueColor="text-lime-500"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Second Row */}
        <AccordionSection title="Diagrams of results">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <DiagramCard title="Test Results Distribution">
              <p className="text-sm">A diagram could go here</p>
            </DiagramCard>
            <DiagramCard title="Performance Metrics Overview">
              <p className="text-sm">A diagram could go here</p>
            </DiagramCard>
            <DiagramCard title="Performance Metrics Comparison">
              <p className="text-sm">A diagram could go here</p>
            </DiagramCard>
            <DiagramCard title="Confusion Matrix Breakdown">
              <p className="text-sm">A diagram could go here</p>
            </DiagramCard>
          </div>
        </AccordionSection>

        {/* Third Row */}
        <AccordionSection title="Results per model">
          <div className="grid grid-cols-1 gap-2">
            {modelResults.map((result) => (
              <ModelResultAccordion key={result.id} result={result} />
            ))}
          </div>
        </AccordionSection>
      </div>
    </div>
  );
}

export default EvaluationResult;

const modelResults = [
  {
    id: 1,
    title: "Arzttermin buchen",
    total: 30,
    status: "failed",
    subtitle: "3/3 correct, 1 false positives",
    expectedCount: 3,
    detectedCount: 4,
    correctCount: 3,
    expectedActivities: [
      "Patientendaten aufnehmen (Activity_0gi1msm)",
      "Termin bestätigen (Activity_1agrvaf)",
      "Erinnerung senden (Activity_1molpic)",
    ],
    detectedActivities: [
      {
        text: "Terminoptionen prüfen (Activity_0khomk4)",
        type: "falsePositive",
      },
      { text: "Patientendaten aufnehmen (Activity_0gi1msm)", type: "correct" },
      { text: "Termin bestätigen (Activity_1agrvaf)", type: "correct" },
      { text: "Erinnerung senden (Activity_1molpic)", type: "correct" },
    ],
    reasoning: [
      {
        activity: "Terminoptionen prüfen (Activity_0khomk4)",
        text: "The activity 'Check appointment options' involves reviewing appointment options...",
        highlight: "error",
      },
      {
        activity: "Patientendaten aufnehmen (Activity_0gi1msm)",
        text: "The activity 'Record patient data' clearly indicates the collection and storage of patient data...",
        highlight: "normal",
      },
    ],
  },
];
