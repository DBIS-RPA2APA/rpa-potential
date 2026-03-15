import { useState } from "react";
import "../styles/index.css";

import { BpmnEditor } from "../components/bpmn/BpmnEditor.jsx";
import SidePanel from "../components/sidePanel/SidePanel.jsx";

function App() {
  const [chatText, setChatText] = useState("");
  const [preparedRequest, setPreparedRequest] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [activeTab, setActiveTab] = useState("settings");

  const [llmPropsDraft, setLlmPropsDraft] = useState({
    modelName: "openai/gpt-4o-mini",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: "",
    temperature: 0.7,
    topP: 1,
    seed: 42,
  });

  const [llmProps, setLlmProps] = useState(null);

  return (
    <>
      <div className="h-screen w-screen bg-slate-100 flex flex-col">
        <main className="flex-1 min-h-0 p-6">
          <div className="h-full grid grid-cols-3 gap-4">
            <div className="col-span-2 min-h-0">
              <BpmnEditor
                setChatText={setChatText}
                analysisResult={analysisResult}
                setPreparedRequest={setPreparedRequest}
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
                chatText={chatText}
                setChatText={setChatText}
                preparedRequest={preparedRequest}
                setPreparedRequest={setPreparedRequest}
                onAnalysisResult={setAnalysisResult}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
