import Button from "../../ui/button";
import "../../styles/index.css";
import NumberStepper from "../../ui/NumberStepper";

const LLMSettingsPanel = ({
  llmPropsDraft,
  setLlmPropsDraft,
  setLlmProps,
  setActiveTab,
  onResetChat,
}) => {
  const updateField = (field, value) => {
    setLlmPropsDraft((prev) => ({
      ...prev, // first copy all old llmProps, to just change the field-> value
      [field]: value,
    }));
  };

  const handleApply = () => {
    setLlmProps(llmPropsDraft);
    console.log("Applied LLM Settings:", llmPropsDraft);
    onResetChat?.();
    setActiveTab("chat");
  };

  return (
    <div className="h-full min-h-0 flex flex-col p-4 border rounded">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900">LLM Settings</h2>
        <p className="text-xs text-slate-500">
          Choose your language model and configure the parameters for analysis
          and chat interactions.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-10 pl-1 pr-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            LLM Model Name
          </label>
          <select
            value={llmPropsDraft.modelName}
            onChange={(e) => updateField("modelName", e.target.value)}
            className="w-full rounded border  text-slate-900"
          >
            <option value="qwen/qwen-2.5-7b-instruct">
              qwen-2.5-7b instruct
            </option>
            <option value="google/gemma-3-12b-it">gemma-3 12b-it</option>
            <option value="mistralai/mistral-7b-instruct-v0.1">
              mistral-7b instruct-v0.1
            </option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            <option value="mistralai/mistral-medium-3.1">
              mistral-medium 3.1
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            LLM Base URL
          </label>
          <input
            type="text"
            value={llmPropsDraft.baseUrl}
            onChange={(e) => updateField("baseUrl", e.target.value)}
            className="w-full rounded border border-slate-400 px-3 py-2 text-slate-900"
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
            className="w-full rounded border border-slate-400 px-3 py-2 text-slate-900"
            placeholder="Optional: overwrites the backend .env"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Seed
          </label>
          <input
            type="text"
            placeholder="Optional"
            value={llmPropsDraft.seed ?? ""}
            onChange={(e) =>
              setLlmPropsDraft({
                ...llmPropsDraft,
                seed: e.target.value,
              })
            }
            className="w-full rounded border border-slate-400 px-3 py-2 text-slate-900"
          />
        </div>

        {/* Number Steppers */}
        <div className="flex flex-col gap-5 mb-10 mt-5 min-[1800px]:flex-row">
          <div className="xl:flex-1">
            <label className="block text-sm font-medium text-black mb-1 min-h-[30px]">
              Temperature
            </label>
            <NumberStepper
              value={llmPropsDraft.temperature}
              onChange={(val) => updateField("temperature", val)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="xl:flex-1">
            <label className="block text-sm font-medium text-black mb-1 min-h-[30px]">
              Top P
            </label>
            <NumberStepper
              value={llmPropsDraft.topP}
              onChange={(val) => updateField("topP", val)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="xl:flex-2">
            <label className="block text-sm font-medium text-black mb-1 min-h-[30px]">
              LLM Response Timeout (seconds)
            </label>
            <NumberStepper
              value={llmPropsDraft.responseTimeout}
              onChange={(val) => updateField("responseTimeout", val)}
              min={0}
              max={400}
              step={1}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button color="primary" size="width" onClick={handleApply}>
          Apply Settings
        </Button>
      </div>
    </div>
  );
};
export default LLMSettingsPanel;
