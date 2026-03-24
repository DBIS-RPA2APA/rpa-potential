import { useState } from "react";
import "../styles/index.css";

import { BpmnEditor } from "../components/bpmn/BpmnEditor.jsx";
import SidePanel from "../components/sidePanel/SidePanel.jsx";

function App() {
  const [chatText, setChatText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  

  const defaultLlmProps = {
    modelName: "openai/gpt-4o-mini",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: "",
    temperature: 0.7,
    topP: 1,
    seed: "",
    responseTimeout: 20,
  };

  const [llmPropsDraft, setLlmPropsDraft] = useState(defaultLlmProps);
  const [llmProps, setLlmProps] = useState(null);

  return (
    <>
      <div className="h-screen w-screen bg-slate-100 flex flex-col">
        <main className="flex-1 min-h-0 p-3">
          <div className="h-full grid grid-cols-3 gap-3">
            <div className="col-span-2 min-h-0">
              <BpmnEditor
                setChatText={setChatText}
                analysisResult={analysisResult}
                onAnalysisResult={(result) => {
                  setAnalysisResult(result);
                  setHasAnalysis(true);
                }}
                llmProps={llmProps ?? defaultLlmProps}
              />
            </div>
            <div className="col-span-1 min-h-0">
              {/* Chat and LLM Settings */}
              <SidePanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                llmPropsDraft={llmPropsDraft}
                setLlmPropsDraft={setLlmPropsDraft}
                llmProps={llmProps}
                setLlmProps={setLlmProps}
                defaultLlmProps={defaultLlmProps}
                chatText={chatText}
                setChatText={setChatText}
                analysisResult={analysisResult}
                hasAnalysis={hasAnalysis}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
