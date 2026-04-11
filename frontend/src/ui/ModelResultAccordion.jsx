import AccordionSection from "./AccordionSection";

function ModelResultAccordion({ result }) {
  const isFailed = result.status === "failed";

  return (
    <AccordionSection
      title={
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-semibold text-slate-900">
              {result.title} ({result.total})
            </p>
            <p className="text-sm text-slate-500 font-normal mt-1">
              {result.subtitle}
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
      defaultOpen={false}
      className="bg-slate-100 border-slate-300"
    >
      <div className="space-y-2">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <SmallSummaryCard label="Expected" value={result.expectedCount} />
          <SmallSummaryCard label="Detected" value={result.detectedCount} />
          <SmallSummaryCard label="Correct" value={result.correctCount} />
        </div>

        {/* Expected / detected */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-rose-800 rounded-md border-2 p-4">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              Expected Activities
            </h4>
            <ul className="space-y-1">
              {result.expectedActivities.map((activity, index) => (
                <li key={index} className="text-emerald-700">
                  • {activity}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-rose-800 rounded-md border-2 p-4">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              Detected Activities
            </h4>
            <ul className="space-y-1">
              {result.detectedActivities.map((activity, index) => (
                <li
                  key={index}
                  className={
                    activity.type === "falsePositive"
                      ? "text-red-700"
                      : "text-emerald-700"
                  }
                >
                  • {activity.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual preview placeholder */}
        <div className="border-rose-800 rounded-md border-2 p-4">
          <h4 className="text-md font-semibold text-slate-900 mb-3">
            Visual Preview
          </h4>
          <div className="h-50 rounded-md border border-dashed border-rose-300 flex items-center justify-center text-slate-700">
            BPMN preview comes here
          </div>
        </div>

        {/* Reasoning table */}
        <div className="border-rose-800 rounded-md border-2 p-4">
          <h4 className="text-lg font-semibold text-slate-900 mb-3">
            AI Model Reasoning
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-300 text-slate-900">
                  <th className="p-3">Activity</th>
                  <th className="p-3">Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {result.reasoning.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      row.highlight === "error"
                        ? "bg-red-100 border-t"
                        : "bg-white border-t"
                    }
                  >
                    <td className="p-3 text-slate-900 font-medium">
                      {row.activity}
                    </td>
                    <td className="p-3 text-slate-700">{row.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AccordionSection>
  );
}
export default ModelResultAccordion;

function SmallSummaryCard({ label, value }) {
  return (
    <div className="border-rose-800 rounded-md border-2 p-4">
      <p className="text-slate-700 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">Activities</p>
    </div>
  );
}
