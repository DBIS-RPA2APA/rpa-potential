import { useEffect, useRef } from "react";
import BpmnJS from "bpmn-js/lib/NavigatedViewer";

export default function BpmnPreview({
  bpmnXml,
  correctActivityIds = [],
  falsePositiveIds = [],
  falseNegativeIds = [],
}) {
  const containerRef = useRef(null); // point to div where diagram should be rendered
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !bpmnXml) return;

    const viewer = new BpmnJS({
      container: containerRef.current,
    });

    viewerRef.current = viewer;

    async function renderDiagram() {
      try {
        await viewer.importXML(bpmnXml);

        const canvas = viewer.get("canvas");
        canvas.zoom("fit-viewport");

        correctActivityIds.forEach((id) => {
          canvas.addMarker(id, "highlight-correct");
        });

        falsePositiveIds.forEach((id) => {
          canvas.addMarker(id, "highlight-false-positive"); // red
        });

        falseNegativeIds.forEach((id) => {
          canvas.addMarker(id, "highlight-false-negative"); // orange
        });
      } catch (err) {
        console.error("Failed to render BPMN preview:", err);
      }
    }

    renderDiagram();

    return () => {
      viewer.destroy();
    };
  }, [bpmnXml, correctActivityIds, falsePositiveIds, falseNegativeIds]);

  return <div ref={containerRef} className="w-full h-70 bg-white rounded" />;
}
