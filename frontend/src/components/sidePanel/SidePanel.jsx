import PanelTabs from "./PanelTabs.jsx";
import ChatPanel from "../chat/ChatPanel.jsx";
import LLMSettingsPanel from "../llmSettings/LLMSettingPanel.jsx";
import EvaluationPanel from "../evaluation/EvaluationPanel.jsx";

const SidePanel = ({
  activeTab,
  setActiveTab,
  llmPropsDraft, // placed in LlmSetting
  setLlmPropsDraft, // placed in LlmSetting
  defaultLlmProps, // placed in app
  llmProps,
  setLlmProps, // placed in LlmSetting and and forwarded to everyone via the app using the side panel
  chatText,
  setChatText,
  analysisResult,
  hasAnalysis,
  setAnalysisResult,
}) => {
  const effectiveLlmProps = llmProps ?? defaultLlmProps; // Use applied settings if available, otherwise use default

  return (
    <div className="h-full flex flex-col bg-[#DFE5F5]/30 rounded-3xl shadow-md border-2 border-white overflow-hidden">
      <PanelTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* LLM Settings Tab */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "settings" && (
          <LLMSettingsPanel
            llmPropsDraft={llmPropsDraft} //  just temporary values, applied to main llmProps when clicks "Apply"
            setLlmPropsDraft={setLlmPropsDraft}
            setLlmProps={setLlmProps}
            setActiveTab={setActiveTab}
            onResetChat={() => setAnalysisResult(null)}
          />
        )}
        {/*  ChatPanel Tab */}
        {effectiveLlmProps && (
          <div className={activeTab === "chat" ? "h-full" : "hidden"}>
            <ChatPanel
              chatText={chatText}
              setChatText={setChatText}
              llmProps={effectiveLlmProps}
              analysisResult={analysisResult}
              hasAnalysis={hasAnalysis}
            />
          </div>
        )}
        {activeTab === "evaluation" && (
          <EvaluationPanel llmProps={effectiveLlmProps} />
        )}
      </div>
    </div>
  );
};
export default SidePanel;
