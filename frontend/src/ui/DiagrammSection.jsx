import { LuCroissant } from "react-icons/lu";

function DiagramCard({ title, children }) {
  return (
    <div className="bg-rose-100 rounded-md p-4 min-h-[320px]">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-md font-semibold text-slate-900">{title}</h4>

        <button
          type="button"
          className="rounded-md bg-rose-300 px-3 py-2 text-rose-600 hover:bg-rose-400"
        >
          <LuCroissant className="h-4 w-4" />
        </button>
      </div>

      <div className="h-[240px] flex items-center justify-center text-slate-500">
        {children}
      </div>
    </div>
  );
}
export default DiagramCard;
