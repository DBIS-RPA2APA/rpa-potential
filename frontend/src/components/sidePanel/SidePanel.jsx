import PanelTabs from "./PanelTabs.jsx";
import ChatPanel from "../chat/ChatPanel.jsx";
import LLMSettingsPanel from "../llmSettings/LLMSettingPanel.jsx";
import EvaluationPanel from "../evaluation/EvaluationPanel.jsx";

const SidePanel = ({
  activeTab,
  setActiveTab,
  llmPropsDraft,
  setLlmPropsDraft,
  defaultLlmProps,
  llmProps,
  setLlmProps,
  chatText,
  setChatText,
  analysisResult,
  hasAnalysis
}) => {

  const effectiveLlmProps = llmProps ?? defaultLlmProps; // Use applied settings if available, otherwise use default


  return (
    <div className="h-full flex flex-col bg-white rounded-md shadow border overflow-hidden">
      <PanelTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    {/* LLM Settings Tab */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "settings" && (
          <LLMSettingsPanel
            llmPropsDraft={llmPropsDraft} //  just temporary values, applied to main llmProps when clicks "Apply"
            setLlmPropsDraft={setLlmPropsDraft}
            setLlmProps={setLlmProps}
            setActiveTab={setActiveTab}
          />
        )}
        {/*  ChatPanel Tab */}
        {activeTab === "chat" && effectiveLlmProps && (
          <ChatPanel
            chatText={chatText}
            setChatText={setChatText}
            llmProps={effectiveLlmProps}
            analysisResult={analysisResult}
            hasAnalysis={hasAnalysis}
          />
        )}
        { activeTab === "evaluation" && (
          <EvaluationPanel
            numRepetitions={effectiveLlmProps.numRepetitions}
            setNumRepetitions={(value) => setLlmProps((prev) => ({ ...prev, numRepetitions: value }))}
            maxConcurrentRequests={effectiveLlmProps.maxConcurrentRequests}
            setMaxConcurrentRequests={(value) => setLlmProps((prev) => ({ ...prev, maxConcurrentRequests: value }))}
            dataset={effectiveLlmProps.dataset}
            setDataset={(value) => setLlmProps((prev) => ({ ...prev, dataset: value }))}
          />
        )
        }
      </div>
    </div>
  );
}
export default SidePanel;
    