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
    temperature: 0.1,
    topP: 1,
    seed: "24523833",
    responseTimeout: 20,
  };

  const [llmPropsDraft, setLlmPropsDraft] = useState(defaultLlmProps);
  const [llmProps, setLlmProps] = useState(null);
  // 0B172D. 97A8D5 657CB7 374E8B
  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden bg-[#657CB7] flex flex-col">
        <div className="absolute top-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

        <div className="absolute bottom-[-300px] left-[-350px] w-[900px] h-[900px] rounded-full bg-orange-300/40 blur-3xl pointer-events-none" />

        <div className="absolute top-[20%] left-[45%] w-[900px] h-[900px] rounded-full bg-[#374E8B30] blur-3xl pointer-events-none" />

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
                setAnalysisResult={setAnalysisResult}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
