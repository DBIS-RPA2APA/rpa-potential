import Button from "../../ui/button";

const LLMSettingsPanel = ({
  llmPropsDraft,
  setLlmPropsDraft,
  setLlmProps,
  setActiveTab,
}) => {
  const updateField = (field, value) => {
    setLlmPropsDraft((prev) => ({ 
        ...prev, 
        [field]: value }));
  }

const handleApply = () => {
    setLlmProps(llmPropsDraft);
    setActiveTab("chat"); // Switch to chat tab after applying settings
  };

  return (
    <div className="h-full flex flex-col p-4 border rounded">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">LLM Settings</h2>
        <p className="text-xs text-slate-500">
          Choose your language model and configure the parameters for analysis and chat interactions.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Modell
          </label>
          <select
            value={llmPropsDraft.modelName}
            onChange={(e) => updateField("modelName", e.target.value)}
            className="w-full rounded border  text-slate-900"
          >
            <option  value="openai/gpt-4o-mini">GPT-4o Mini</option>
            <option  value="google/gemma-2-9b-it">Gemma 2 9B</option>
            <option  value="google/gemma-2-27b-it">Gemma 2 27B</option>
            <option  value="mistralai/mistral-7b-instruct">Mistral 7B Instruct</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Base URL
          </label>
          <input
            type="text"
            value={llmPropsDraft.baseUrl}
            onChange={(e) => updateField("baseUrl", e.target.value)}
            className="w-full rounded border px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            API Key
          </label>
          <input
            type="password"
            value={llmPropsDraft.apiKey}
            onChange={(e) => updateField("apiKey", e.target.value)}
            className="w-full rounded border px-3 py-2 text-slate-900"
            placeholder="Optional: überschreibt Backend .env"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Temperature
          </label>
          <input
            type="number"
            step="0.1"
            value={llmPropsDraft.temperature}
            onChange={(e) => updateField("temperature", Number(e.target.value))}
            className="w-full rounded border px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Top P
          </label>
          <input
            type="number"
            step="0.1"
            value={llmPropsDraft.topP}
            onChange={(e) => updateField("topP", Number(e.target.value))}
            className="w-full rounded border px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Seed
          </label>
          <input
            type="number"
            value={llmPropsDraft.seed}
            onChange={(e) => updateField("seed", Number(e.target.value))}
            className="w-full rounded border px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div className="mt-auto">
        <Button color="primary" size="width" onClick={handleApply} >
          Apply Settings
        </Button>
      </div>
    </div>
  );
}
export default LLMSettingsPanel;