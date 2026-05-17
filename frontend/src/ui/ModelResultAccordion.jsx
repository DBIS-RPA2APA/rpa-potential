import AccordionSection from "./AccordionSection";
import BpmnPreview from "../components/evaluation/BpmnPreview";
import ScorePopup from "./ScorePopUp";
import { LuBadgeInfo } from "react-icons/lu";
import React from "react";

function ModelResultAccordion({ result }) {
  const isFailed = !result.isSuccessful;

  const expectedCount = result.expectedNamesWithIds.length ?? 0;
  const detectedCount = result.actualNamesWithIds.length ?? 0;
  const correctCount = result.correctActivityIds.length ?? 0;
  const [scorePopupVisible, setScorePopupVisible] = React.useState(false);

  return (
    <>
      <AccordionSection
        title={
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                {result.testCaseName}
              </p>
              <p className="text-sm text-slate-500 font-normal mt-1">
                {correctCount}/{expectedCount} correct,{" "}
                {result.falsePositiveIds.length ?? 0} false positives,{" "}
                {result.falseNegativeIds.length ?? 0} false negatives
              </p>
            </div>

            <span
              className={`mr-4 px-3 py-1 rounded-full text-sm font-medium text-white ${
                isFailed ? "bg-red-700" : "bg-emerald-700"
              }`}
            >
              {isFailed ? "Failed" : "Passed"}
            </span>
          </div>
        }
        className="bg-slate-100 border-slate-300"
      >
        <div className="space-y-2">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-2">
            <SmallSummaryCard label="Expected" value={expectedCount} />
            <SmallSummaryCard label="Detected" value={detectedCount} />
            <SmallSummaryCard label="Correct" value={correctCount} />
          </div>

          {/* Expected / detected list*/}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-[#10214D] rounded-3xl border-2 p-4">
              <h4 className="text-md font-semibold text-slate-900 mb-2">
                Expected Activities
              </h4>
              <ul className="space-y-1">
                {result.result
                  ?.filter((item) => item.expectedScore !== null)
                  .map((activity) => (
                    <li key={activity.id} className="text-emerald-700 text-sm">
                      • {activity.name} ({activity.id})
                    </li>
                  ))}
              </ul>
            </div>

            <div className="border-[#10214D] rounded-3xl border-2 p-4">
              <h5 className="text-md font-semibold text-slate-900 mb-2">
                Detected Activities
              </h5>
              <ul className="space-y-1">
                {result.result
                  ?.filter((item) => item.llmScore !== null)
                  .map((activity) => (
                    <li
                      key={activity.id}
                      className={
                        activity.status === "falsePositive"
                          ? "text-red-700 text-sm"
                          : "text-emerald-700 text-sm"
                      }
                    >
                      • {activity.name} ({activity.id})
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Visual preview placeholder */}
          <div className="border-[#10214D] rounded-3xl border-2 p-4">
            <h4 className="text-md font-semibold text-slate-900 mb-3">
              Visual Preview
            </h4>

            <BpmnPreview
              bpmnXml={result.imageSrc}
              correctActivityIds={result.correctActivityIds} // green
              falsePositiveIds={result.falsePositiveIds} // red
              falseNegativeIds={result.falseNegativeIds} // orange
            />
          </div>

          {/* Reasoning table */}
          <div className="border-[#10214D] rounded-3xl border-2 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900">
                AI Model Reasoning
              </h4>
              <button
                onClick={() => setScorePopupVisible(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:bg-slate-200 cursor-pointer"
              >
                <LuBadgeInfo size={22} color="black" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-300 text-slate-900">
                    <th className="p-3">Activity</th>
                    <th className="p-3">LLM Score</th>
                    <th className="p-3">Expected Score</th>
                    <th className="p-3">Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {result.result
                    .filter((row) => row.llmScore !== null)
                    .map((row, index) => (
                      <tr
                        key={index}
                        className={
                          row.status === "falsePositive"
                            ? "bg-red-200 border-t"
                            : "bg-white border-t"
                        }
                      >
                        <td className="p-2 text-slate-900 font-medium">
                          {row.name} ({row.id})
                        </td>
                        <td className="p-2 text-slate-700">
                          {row.llmScore ? row.llmScore.join(", ") : "—"}
                        </td>
                        <td className="p-2 text-slate-700">
                          {row.expectedScore
                            ? row.expectedScore.join(", ")
                            : "—"}
                        </td>
                        <td className="p-2 text-slate-700">
                          {row.reasoning ?? "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AccordionSection>
      {scorePopupVisible && (
        <ScorePopup
          variant="modal"
          onClose={() => setScorePopupVisible(false)}
        />
      )}
    </>
  );
}
export default ModelResultAccordion;

function SmallSummaryCard({ label, value }) {
  return (
    <div className="border-[#10214D] rounded-3xl border-2 p-4">
      <p className="text-slate-700 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">Activities</p>
    </div>
  );
}
/*{
  testCaseID,
  testCaseName,
  datasetId,
  imageSrc,
  correctActivityIds,
  falsePositiveIds,
  falseNegativeIds,
  expectedNamesWithIds,
  actualNamesWithIds,
  isSuccessful,
  result,
  amountOfRetries
}*/
