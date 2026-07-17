import Button from "../../ui/button";
import { LuUpload, LuDownload, LuPlus, LuBadgeInfo } from "react-icons/lu";
import ScorePopup from "../../ui/ScorePopUp";
import React from "react";

export function BpmnToolbar({
  fileInputRef, // ref for the hidden file input
  onFileSelected,
  onDownload,
  onAnalyze,
  onCreateNew,
  onClear,
  onReport,
  isAnalyzing,
}) {
  const [scorePopupVisible, setScorePopupVisible] = React.useState(false);
  const handleScorePopup = () => {
    if (scorePopupVisible) {
      setScorePopupVisible(false);
    } else {
      setScorePopupVisible(true);
    }
  };
  return (
    <>
      <div
        className="
          w-full
          bg-white/20
          backdrop-blur-xl
          rounded-3xl xl:rounded-[6rem]
          border-2 border-white/30
          shadow-md
          px-3 py-3
          min-h-[90px]
          xl:min-h-[70px]"
      >
        {" "}
        <div className="flex w-full flex-col gap-2 lg:items-center lg:justify-between lg:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept=".bpmn,.xml"
            className="hidden"
            onChange={(e) => onFileSelected(e.target.files[0])}
          />
          {/* Buttons Left */}
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <Button
              color="secondary"
              size="medium"
              onClick={onCreateNew}
              icon={<LuPlus size={15} />}
              disabled={isAnalyzing}
            >
              New
            </Button>
            <Button
              color="secondary"
              size="medium"
              onClick={onDownload}
              icon={<LuDownload size={15} />}
              disabled={isAnalyzing}
            >
              Download
            </Button>
            <Button
              color="primary"
              size="medium"
              onClick={() => fileInputRef.current.click()}
              icon={<LuUpload size={15} />}
              disabled={isAnalyzing}
            >
              Upload
            </Button>
          </div>
          {/* Buttons Right */}
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
            <Button
              color="primary"
              size="medium"
              onClick={onAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze BPMN"}
            </Button>
            <Button
              color="secondary"
              size="medium"
              onClick={onClear}
              disabled={isAnalyzing}
            >
              Clear BPMN
            </Button>
            <Button
              color="secondary"
              size="medium"
              onClick={onReport}
              disabled={isAnalyzing}
            >
              Download Report
            </Button>
            <button
              onClick={handleScorePopup}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/35 hover:bg-white/50 transition cursor-pointer"
            >
              <LuBadgeInfo size={48} color="white" />
            </button>
          </div>
        </div>
      </div>
      {scorePopupVisible && (
        <ScorePopup onClose={() => setScorePopupVisible(false)} />
      )}
    </>
  );
}
