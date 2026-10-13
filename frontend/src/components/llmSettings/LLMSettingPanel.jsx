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
  // bg-[#DFE5F5]/30
  return (
    <div className="h-full min-h-0 flex flex-col p-4  bg-[#DFE5F5]/70">
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
            className="w-full rounded-xl border text-slate-900 bg-white/30 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
          >
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            <option value="openai/gpt-6-astra">GPT-6 Astra</option>
            <option value="openai/gpt-6.1-sol">GPT-6.1 Sol</option>

            <option value="qwen/qwen3-vl-8b-instruct">
              qwen3-vl-8b-instruct
            </option>
            <option value="qwen/qwen-2.5-7b-instruct">
              qwen-2.5-7b instruct
            </option>
            <option value="mistralai/ministral-8b-2512">
              ministral-8b-2512
            </option>
            <option value="google/gemma-3-12b-it">gemma-3 12b-it</option>
            <option value="deepseek/deepseek-v3.2">Deepseek-v3.2</option>

            <option value="qwen/qwen3-vl-30b-a3b-instruct">
              qwen3-vl-30b-a3b-instruct
            </option>
            <option value="qwen/qwen3-vl-32b-instruct">
              qwen3-vl-32b-instruct
            </option>
            <option value="mistralai/mixtral-8x22b-instruct">
              Mixtral-8x22b-instruct
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
            className="w-full rounded-xl border-2 border-[#425176] px-3 py-2 text-slate-700 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
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
            className="w-full rounded-xl border-2 border-[#425176] px-3 py-2 text-slate-700 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
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
            className="w-full rounded-xl border-2 border-[#425176] px-3 py-2 text-slate-700 bg-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
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
        <Button color="thirdary" size="width" onClick={handleApply}>
          Apply Settings
        </Button>
      </div>
    </div>
  );
};
export default LLMSettingsPanel;
