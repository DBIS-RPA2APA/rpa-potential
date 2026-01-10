import Button from "../../ui/button";

export function BpmnToolbar({
  fileInputRef, // ref for the hidden file input
  onFileSelected, // function to handle file selection
  onDownload, // function to handle download action
}) {
  return (
    <div className="flex items-center bg-white rounded shadow border px-4 py-3">
      <div className="flex-1" />
      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".bpmn,.xml"
          className="hidden"
          onChange={(e) => onFileSelected(e.target.files[0])}
        />

        <Button
          color="primary"
          size="medium"
          onClick={() => fileInputRef.current.click()}
        >
          Upload BPMN
        </Button>

        <Button color="secondary" size="medium" onClick={onDownload}>
          Download BPMN
        </Button>
      </div>
    </div>
  );
}
