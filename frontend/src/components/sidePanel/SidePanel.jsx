import PanelTabs from "./PanelTabs.jsx";
import ChatPanel from "../chat/ChatPanel.jsx";
import LLMSettingsPanel from "../llmSettings/LLMSettingPanel.jsx";
import EvaluationPanel from "../evaluation/EvaluationPanel.jsx";

import { useState } from "react";

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
  setOnEvaluation,
}) => {
  const effectiveLlmProps = llmProps ?? defaultLlmProps; // Use applied settings if available, otherwise use default
  const [chatResetToken, setChatResetToken] = useState(0);

  return (
    <div className="h-full flex flex-col bg-white rounded-md shadow border overflow-hidden">
      <PanelTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* LLM Settings Tab */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "settings" && (
          <LLMSettingsPanel
            llmPropsDraft={llmPropsDraft} //  just temporary values, applied to main llmProps when clicks "Apply"
            setLlmPropsDraft={setLlmPropsDraft}
            setLlmProps={setLlmProps}
            setActiveTab={setActiveTab}
            onResetChat={() => setChatResetToken((prev) => prev + 1)}
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
            resetToken={chatResetToken}
          />
        )}
        {activeTab === "evaluation" && (
          <EvaluationPanel
            numRepetitions={effectiveLlmProps.numRepetitions}
            setNumRepetitions={(value) =>
              setLlmProps((prev) => ({ ...prev, numRepetitions: value }))
            }
            maxConcurrentRequests={effectiveLlmProps.maxConcurrentRequests}
            setMaxConcurrentRequests={(value) =>
              setLlmProps((prev) => ({ ...prev, maxConcurrentRequests: value }))
            }
            llmProps={effectiveLlmProps}
            setOnEvaluation={setOnEvaluation}
          />
        )}
      </div>
    </div>
  );
};
export default SidePanel;
