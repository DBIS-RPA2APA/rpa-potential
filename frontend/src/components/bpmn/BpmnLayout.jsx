import { BpmnToolbar } from "./BpmnToolbar";

// rendering BPMN modeler container and toolbar
// receives refs and callbacks from the parent component (BpmnEditor) to manage file input, downloading, and error handling.
export function BpmnLayout({
  containerRef, // ref for the BPMN modeler container
  fileInputRef, 
  onFileSelected, 
  onDownload, 
  onAnalyze, 
  onCreateNew, 
  onClear, 
  onReport, 
  error
}) {
  return (
    <div className="h-full flex flex-col">
      <BpmnToolbar
        fileInputRef={fileInputRef}
        onFileSelected={onFileSelected}
        onDownload={onDownload}
        onAnalyze={onAnalyze}
        onCreateNew={onCreateNew}
        onClear={onClear}
        onReport={onReport}
      />

      {error && (
        <div className="mx-4 mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 pt-4 bg-slate-100">
        <div className="h-full bg-white rounded-md shadow borde overflow-hidden">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
