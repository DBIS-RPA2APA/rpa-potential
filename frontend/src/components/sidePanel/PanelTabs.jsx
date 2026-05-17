const PanelTabs = ({ activeTab, setActiveTab }) => {
  const baseClasses = "px-4 py-4 text-md ";
  const activeClasses =
    "bg-[#DFE5F5]/70  text-black font-semibold border-b-2 border-[#97A8D5] ";
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
