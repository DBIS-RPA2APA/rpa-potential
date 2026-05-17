import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

function AccordionSection({ title, children, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-3xl border shadow overflow-hidden ${
        className || "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex-1 text-slate-900 text-xl font-semibold">
          {title}
        </div>

        <span className="text-slate-500 text-xl">
          {isOpen ? <LuChevronUp size={30} /> : <LuChevronDown size={30} />}
        </span>
      </button>

      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default AccordionSection;
