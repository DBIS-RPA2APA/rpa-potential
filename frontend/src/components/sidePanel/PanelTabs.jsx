const PanelTabs = ({ activeTab, setActiveTab }) => {
  const baseClasses = "px-4 py-4 text-md ";
  const activeClasses = "bg-white/45 text-black font-semibold";
  const inactiveClasses =
    "text-slate-700 hover:bg-white/15 cursor-pointer font-light";

  return (
    <div className="flex items-center">
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
