import React from "react";

const AnalysisPopup = ({
  elementId,
  reason,
  title = "Analysis Result",
  score,
  //visibility = "visible",
}) => {
  return (
    <div className=" bg-white rounded-xl shadow-md border-2 border-gray-300 p-4 min-w-100 max-w-220 text-md text-slate-900 z-9999 relative pointer-events-none" >
      <div className="mb-2">
        <span className="text-lg font-bold text-navy">{title}</span>
      </div>

      <div className="display-flex flex-col gap-2">
        <div className="display-flex flex-start gap-2 ">
          <span className="font-bold text-slate-900 min-w-xl">ID: </span>
          <span className="text-slate-900 word-break">{elementId}</span>
        </div>

        <div className="analysis-popup__row analysis-popup__row--column">
          <span className=" font-bold text-slate-900 min-w-2xl">Reason: </span>
          <span className="text-slate-900 word-break">{reason}</span>
        </div>

        {score !== undefined && score !== null && (
          <div className="analysis-popup__row">
            <span className="font-bold text-slate-900 min-w-2xl">Score:</span>
            <span className="text-slate-900 word-break">{score}</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default AnalysisPopup;