import PanelTabs from "./PanelTabs.jsx";
import ChatPanel from "../chat/ChatPanel.jsx";
import LLMSettingsPanel from "../llmSettings/LLMSettingPanel.jsx";

const SidePanel = ({
  activeTab,
  setActiveTab,
  llmPropsDraft,
  setLlmPropsDraft,
  llmProps,
  setLlmProps,
  chatText,
  setChatText,
  preparedRequest,
  setPreparedRequest,
  onAnalysisResult,
}) => {

    const chatEnabled = !!llmProps; // Enable chat only if a model is selected

  return (
    <div className="h-full flex flex-col bg-white rounded-md shadow border overflow-hidden">
      <PanelTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chatEnabled={chatEnabled}
      />
    {/* LLM Settings Tab */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "settings" && (
          <LLMSettingsPanel
            llmPropsDraft={llmPropsDraft}
            setLlmPropsDraft={setLlmPropsDraft}
            setLlmProps={setLlmProps}
            setActiveTab={setActiveTab}
          />
        )}
        {/*  ChatPanel Tab */}
        {activeTab === "chat" && chatEnabled && (
          <ChatPanel
            chatText={chatText}
            setChatText={setChatText}
            preparedRequest={preparedRequest}
            setPreparedRequest={setPreparedRequest}
            onAnalysisResult={onAnalysisResult}
            llmProps={llmProps}
          />
        )}

        {activeTab === "chat" && !chatEnabled && (
          <div className="h-full flex items-center justify-center p-6 text-sm text-slate-500">
            Bitte zuerst ein LLM in den Einstellungen konfigurieren.
          </div>
        )}
      </div>
    </div>
  );
}
export default SidePanel;
    