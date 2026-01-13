import { BpmnToolbar } from "./BpmnToolbar";
import ChatInput from "../chat/ChatInput";

export function BpmnLayout({
  containerRef, // ref for the BPMN modeler container
  fileInputRef, // from BpmnToolbar
  onFileSelected, // from BpmnToolbar
  onDownload, // from BpmnToolbar
  onExtract, // from BpmnToolbar
  error,
  chatText,
  setChatText,
  onSendChat,
}) {
  return (
    <div className="h-full flex flex-col">
      <BpmnToolbar
        fileInputRef={fileInputRef}
        onFileSelected={onFileSelected}
        onDownload={onDownload}
        onExtract={onExtract}
      />

      {error && (
        <div className="mx-4 mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 pt-4 bg-slate-100">
        <div className="h-full  bg-white rounded shadow border overflow-hidden">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
