import { LuX } from "react-icons/lu";

function DiagrammPopup({ onClose, title, children }) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
        <div className="flex max-h-screen  w-full max-w-5xl flex-col rounded-md border border-slate-200 bg-rose-100 p-6 text-sm text-slate-700 shadow-md">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-slate-50"
            >
              <LuX size={25} color="black" />
            </button>
          </div>

          <div className="w-full flex flex-1 items-center justify-center">
            {children({ width: 900, height: 500 })}
          </div>
        </div>
      </div>
    </>
  );
}
export default DiagrammPopup;
