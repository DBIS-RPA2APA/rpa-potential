const PanelTabs = ({ activeTab, setActiveTab }) => {
  const baseClasses =
    "px-4 py-2 text-sm text-slate-300  font-medium rounded-tl-md rounded-tr-md";
  const activeClasses = "bg-white text-slate-900";
  const inactiveClasses =
    "bg-slate-15 text-slate-500 hover:bg-slate-200 cursor-pointer";

  return (
    <div className="flex items-center bg-slate-100">
      <button
        type="button"
        onClick={() => setActiveTab("settings")}
        className={`${baseClasses} ${
          activeTab === "settings" ? activeClasses : inactiveClasses
        }`}
      >
        LLM Settings
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveTab("chat");
        }}
        className={`${baseClasses} ${
          activeTab === "chat" ? activeClasses : inactiveClasses
        } `}
      >
        Chat
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveTab("evaluation");
        }}
        className={`${baseClasses} ${
          activeTab === "evaluation" ? activeClasses : inactiveClasses
        } `}
      >
        Evaluation
      </button>
    </div>
  );
};
export default PanelTabs;
