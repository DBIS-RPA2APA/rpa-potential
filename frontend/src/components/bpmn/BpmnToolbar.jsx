import Button from "../../ui/button";
import { LuUpload, LuDownload, LuPlus  } from "react-icons/lu";

export function BpmnToolbar({
  fileInputRef, // ref for the hidden file input
  onFileSelected, // function to handle file selection
  onDownload, // function to handle download action
  onExtract, // function to handle extract action
  onCreateNew,
  onClear,
  onReport
}) {
  return (
    <div className="flex items-center bg-white rounded shadow border px-4 py-3">
      <div className="flex w-full flex-col gap-3 md:flex-row md:justify-between">
        <input
          ref={fileInputRef}
          type="file"
          accept=".bpmn,.xml"
          className="hidden"
          onChange={(e) => onFileSelected(e.target.files[0])}
        />
      {/* Buttons Left */}
        <div className="flex gap-2">
          <Button color="secondary" size="medium" onClick={onCreateNew}
          icon={<LuPlus size={15} /> }>
            Create new
          </Button>
          <Button color="secondary" size="medium" onClick={onDownload}
          icon={<LuDownload size={15} /> }>
            Download BPMN
          </Button> 
          <Button
            color="primary"
            size="medium"
            onClick={() => fileInputRef.current.click()}
            icon={<LuUpload size={15} /> }
          >
            Upload BPMN
          </Button>
        </div>
      {/* Buttons Right */}
        <div className="flex  gap-2"> 
          <Button color="primary" size="medium" onClick={onExtract}>
            Extract Tasks
          </Button>
          <Button color="secondary" size="medium" onClick={onClear}>
            Clear BPMN
          </Button>
           <Button color="secondary" size="medium" onClick={onReport}>
            Download Report
          </Button>
        </div>  
      </div>
    </div>
  );
}
