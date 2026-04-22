import { LuX } from "react-icons/lu";

const ScorePopup = ({ onClose, variant = "inline" }) => {
  const left = [
    {
      id: 1,
      test: "The activity is performed by a human with the use of a system or multiple systems. For example: Entering data into an ERP or CRM system, Copying information from one system into another, Submitting forms through web-based applications, Retrieving customer or transaction data from an information system.",
    },
    {
      id: 2,
      test: "The activity is based on well-defined and unambiguous rules. Ambiguous rules have more than one interpretation or meaning. Each rule formulation should not leave room for misinterpretation. It must unambiguously describe the rule behavior. For example: Validation of mandatory form fields, Verification that values meet predefined thresholds, Application of fixed approval criteria, Comparison of invoices with purchase orders.",
    },
    {
      id: 3,
      test: "The activity is based on stable and unchanging rules. For example: Fixed calculation formulas, Recurrent validation procedures, Standardized data verification steps.",
    },
    {
      id: 4,
      test: "The rules are strictly enforced during the execution of the activity, as opposedto being considered as just guidelines. Business rules that guide behavior require enforcement. For example: Hard-coded process rules, Automatic rejection if required data is missing, Non-negotiable business restrictions.",
    },
    {
      id: 5,
      test: "The activity/rule does not require creativity or complex interpretation efforts. For example: Comparing values or identifiers, Selecting predefined options from a list, Following step-by-step procedural instructions.",
    },
  ];
  const right = [
    {
      id: 6,
      test: "The activity is executed within stable context. All interactions between the process activities and software applications are well-specified and predictable. For example: Predictable system behavior, Consistent interaction patterns with applications, Well-defined system interfaces, Limited variation in execution environment.",
    },
    {
      id: 7,
      test: "he activity/rule uses available structured data. For example: Structured XML, CSV, or JSON files, Forms with predefined fields, Spreadsheet-based data.",
    },
    {
      id: 8,
      test: "All the data needed by the activity/rule are available in digital format. This is required as RPA is a software-based solution. For Example: Digitally submitteforms, Electronic invoices or documents, System-generated reports, Digitally stored records.",
    },
    {
      id: 9,
      test: "The rule has no or few exceptions or alternatives. For Example: Few conditional branches, Limited error handling cases, Straight-through processing, Single decision outcome.",
    },
  ];
  const isModal = variant === "modal";

  const popupContent = (
    <div
      className={
        isModal
          ? "flex max-h-[80vh] w-full max-w-5xl flex-col rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-2xl"
          : "mt-2 flex h-[200px] w-full flex-col rounded-md border border-slate-200 bg-blue-50 p-5 text-sm text-slate-700 shadow-md"
      }
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Scoring criteria according to Bédard et al.
        </h3>
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-slate-100"
        >
          <LuX size={20} color="black" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8">
          <div className="space-y-2">
            {left.map((item) => (
              <div key={item.id} className="flex gap-2">
                <span className="w-2 font-semibold">{item.id}:</span>
                <p className="text-md">{item.test}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {right.map((item) => (
              <div key={item.id} className="flex gap-2">
                <span className="w-2 font-semibold">{item.id}:</span>
                <p className="text-md">{item.test}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-600 flex items-center justify-center bg-black/35 p-4">
        {popupContent}
      </div>
    );
  }
  return popupContent;
};
export default ScorePopup;
