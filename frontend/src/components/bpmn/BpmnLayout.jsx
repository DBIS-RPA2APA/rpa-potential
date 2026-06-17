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
  isAnalyzing,
  error,
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
        isAnalyzing={isAnalyzing}
      />

      {error && (
        <div className="mx-4 mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="relative flex-1 pt-2">
        <div className="h-full shadow-md border-2 border-white rounded-3xl bg-white/60 overflow-hidden">
          <div ref={containerRef} className="h-full w-full" />

          {isAnalyzing && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl mt-2">
              <div className="h-13 w-13 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                BPMN is being analyzed...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
