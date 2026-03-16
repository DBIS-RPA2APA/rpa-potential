import Button from "../../ui/button";
import "../../styles/index.css";
import CompactNumberStepper from "../../ui/NumberStepper";

const EvaluationPanel = ({
    numRepetitions,
    setNumRepetitions,
    maxConcurrentRequests,
    setMaxConcurrentRequests,
    dataset,
    setDataset,
}) => {
  

const handleEvaluation = () => {
    
  };

  return (
    <div className="h-full min-h-0 flex flex-col p-4 border rounded">
            {/* Evaluation Settings*/}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900">Evaluation Settings</h2>
                <p className="text-xs text-slate-500">
                    Choose your evaluation datasets and configure the parameters for the evaluation.
                </p>
            </div>
            
        <div className="flex-1 min-h-0 overflow-y-auto space-y-10 pl-1 pr-4">
            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    Number of Repetitions
                </label>
                <input
                    type="number"
                    value={numRepetitions}
                    onChange={(e) => setNumRepetitions(Number(e.target.value))}
                    className="w-full rounded border border-slate-400 px-3 py-2 text-slate-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    Max Concurrent LLM Requests
                </label>
                <input
                    type="number"
                    value={maxConcurrentRequests}
                    onChange={(e) => setMaxConcurrentRequests(Number(e.target.value))}
                    className="w-full rounded border border-slate-400 px-3 py-2 text-slate-900"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">
                    Select Datasets
                </label>
                <select
                    value={dataset}
                    onChange={(e) => setDataset(e.target.value)}
                    className="w-full rounded border  text-slate-900"
                >
                    <option  value="dataSet1">Dataset 1</option>
                    <option  value="dataSet2">Dataset 2</option>
                    <option  value="dataSet3">Dataset 3</option>
                    <option  value="dataSet4">Dataset 4</option>
                </select>
            </div>

        </div>

        <div className="mt-auto">
            <Button color="primary" size="width" onClick={handleEvaluation} >
            Apply Evaluation
            </Button>
        </div>
    </div>
  );
}
export default EvaluationPanel;