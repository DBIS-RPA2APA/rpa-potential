import { LuX } from "react-icons/lu";
import { createPortal } from "react-dom";

function DiagrammPopup({ onClose, title, children }) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/40 p-6">
        <div className="flex max-h-screen  w-full max-w-5xl flex-col rounded-3xl border border-slate-200 bg-white/45 p-6 text-sm text-slate-700 shadow-md backdrop-blur-xl">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-white/30"
            >
              <LuX size={30} color="black" />
            </button>
          </div>

          <div className="w-full flex flex-1 items-center justify-center">
            {children({ width: 900, height: 500 })}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
export default DiagrammPopup;
