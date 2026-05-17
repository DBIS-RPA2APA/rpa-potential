import { LuCroissant } from "react-icons/lu";
import { useState } from "react";
import DiagrammPopup from "./DiagrammPopUp";

function DiagramCard({ title, children }) {
  const [diagrammVisible, setDiagrammVisible] = useState(false);
  return (
    <>
      <div className="bg-[#FFF4EE] rounded-xl p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-md font-semibold text-slate-900">{title}</h4>

          <button
            type="button"
            className="rounded-md bg-[#FF6200]/30 px-2 py-2 text-[#FF6200] hover:bg-[#FF6200]/50 cursor-pointer"
            onClick={() => setDiagrammVisible(true)}
          >
            <LuCroissant className="h-5 w-5" />
          </button>
        </div>

        <div className="h-60 flex items-center justify-center text-slate-500">
          {children({ width: 600, height: 260 })}
        </div>
      </div>
      {diagrammVisible && (
        <DiagrammPopup title={title} onClose={() => setDiagrammVisible(false)}>
          {children}
        </DiagrammPopup>
      )}
    </>
  );
}
export default DiagramCard;
