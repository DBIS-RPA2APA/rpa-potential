import { useEffect, useRef, useCallback, useState} from "react";
import { createRoot } from "react-dom/client";

import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "../../styles/bpmn-style/bpmn.css";

import initialDiagram from "../../data/empty.bpmn?raw";
import { BpmnLayout } from "./BpmnLayout.jsx";
//import { preparePromptPreview } from "../../services/bpmn/preparePrompt.js";
import  AnalysisPopup  from "../../ui/AnalysisPopup.jsx";
import { analyzeElements } from "../../services/api/analyzeApi.js";
import { extractFromXml } from "../../services/bpmn/extractFromXml.js";


// main component for the BPMN editor, responsible for initializing the BPMN modeler, handling file imports, 
// managing state for errors and analysis results, and passing necessary refs and callbacks to the BpmnLayout component for rendering the UI.
export function BpmnEditor({
  analysisResult,
  onAnalysisResult,
  llmProps,

}) {
  const containerRef = useRef(null);
  const modelerRef = useRef(null);
  const fileInputRef = useRef(null); 

  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current) return; 

    const modeler = new BpmnModeler({
      container: containerRef.current,
    });

    modeler
      .importXML(initialDiagram)
      .then(() => console.log(modeler.get("elementRegistry").getAll()))
      .catch((err) => console.error("Error loading BPMN diagram", err));

    modelerRef.current = modeler;

    return () => {
      modeler.destroy();
    };
  }, []);


  useEffect(() => {
    if (!modelerRef.current) return;
    if (!analysisResult?.criticalElements) return;

    const modeler = modelerRef.current;
    const registry = modeler.get("elementRegistry"); // all elements in diagram, by ID to color them
    const modeling = modeler.get("modeling"); // modeling API to change element styles, colors, etc.

    // ---  Reset: remove old colors ---
    const all = registry.getAll();
    const tasks = all.filter((el) => isTask(el));

    tasks.forEach((el) => {
      // bpmn-js set default style 
      modeling.setColor(el, { fill: null, stroke: null });
    });

    // --- color critic elements  ---
    analysisResult.criticalElements.forEach((crit) => {
      const el = registry.get(crit.id);
      if (!el) {
        console.warn("No element found for ID:", crit.id);
        return;
      }
      // set color for critical elements, red fill and stroke
      modeling.setColor(el, { fill: "#FEE2E2", stroke: "#DC2626" });
    });
    //console.log("critical:",analysisResult.criticalElements.map((x) => x.id));
  }, [analysisResult]); // start just when analysisResult changes 


  function findCriticalElementById(analysisResult, elementId) {
    if (!analysisResult?.criticalElements) return null;
    return analysisResult.criticalElements.find((item) => item.id === elementId) ?? null;
  }
  // --- Hover Popup: shows analysis details when hovering over critical elements ---
    useEffect(() => {
      const modeler = modelerRef.current;
      if (!modeler || !analysisResult?.criticalElements?.length) return;

      const eventBus = modeler.get("eventBus");
      const overlays = modeler.get("overlays");

      let overlayId = null; // to track the current overlay, so we can remove it when needed
      let popupRoot = null;
      let hoveredId = null;
      let showTimeout = null;
      let hideTimeout = null; 
      let pinnedId = null; 

      // remove popup and overlay when mouse leaves element
      const cleanupPopup = () => {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);

        if (overlayId) overlays.remove(overlayId);
        if (popupRoot) popupRoot.unmount();

        overlayId = null;
        popupRoot = null;
        hoveredId = null;
      };

      const renderPopup = (element, crit) => {
        if (overlayId) overlays.remove(overlayId);
        if (popupRoot) popupRoot.unmount();

        const container = document.createElement("div");
        popupRoot = createRoot(container);

        popupRoot.render(
          <AnalysisPopup
            elementId={crit.id}
            reason={crit.reason ?? "No reason provided"}
            score={crit.score}
            title="This element can be automated"
          />
        );

        overlayId = overlays.add(element, {
          position: { bottom: -10, left: -10 },
          html: container,
        });

        hoveredId = element.id;
      };
      // show popup with delay when hovering over critical element
      const handleHover = ({ element }) => {
        if (pinnedId) return; // wenn gepinnt, Hover ignorieren
        if (!element || !isTask(element)) return;

        const crit = findCriticalElementById(analysisResult, element.id);
        if (!crit) return;

        clearTimeout(hideTimeout);

        showTimeout = setTimeout(() => {
          if (hoveredId === element.id && overlayId) return;
          renderPopup(element, crit);
        }, 150);
      };
      // hide popup with delay when mouse leaves element, but only if not pinned
      const handleOut = ({ element }) => {
        if (pinnedId) return; // wenn gepinnt, nicht schließen

        clearTimeout(showTimeout);

        hideTimeout = setTimeout(() => {
          if (hoveredId === element?.id) {
            cleanupPopup();
          }
        }, 120);
      };
      // click to pin/unpin popup
      const handleClick = ({ element }) => {
        if (!element || !isTask(element)) {
          pinnedId = null;
          cleanupPopup();
          return;
        }

        const crit = findCriticalElementById(analysisResult, element.id);

        if (!crit) {
          pinnedId = null;
          cleanupPopup();
          return;
        }

        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);

        pinnedId = element.id;
        renderPopup(element, crit);
      };
        const handleCanvasClick = () => {
          pinnedId = null;
          cleanupPopup();
        };

        eventBus.on("element.hover", handleHover);
        eventBus.on("element.out", handleOut);
        eventBus.on("element.click", handleClick);
        eventBus.on("canvas.click", handleCanvasClick);

        return () => {
          eventBus.off("element.hover", handleHover);
          eventBus.off("element.out", handleOut);
          eventBus.off("element.click", handleClick);
          eventBus.off("canvas.click", handleCanvasClick);
          cleanupPopup();
        };
      }, [analysisResult]); 

      // --- Import function: imports BPMN XML string into modeler ---
      const importXmlString = useCallback(async (xml) => {
        try {
          setError("");
          await modelerRef.current.importXML(xml);
          console.log("Import erfolgreich");
          console.log(modelerRef.current.get("elementRegistry").getAll());
        } catch (e) {
          console.error(e);
          setError("Import fehlgeschlagen");
          await modelerRef.current.importXML(initialDiagram);
        }
      }, []);

  // --- Extract function: prepares and extracts elements ---
  // const f = useCallback(fn, [a, b]); -> Erstelle die Funktion neu, wenn sich einer der Werte a,b ändert, die innen benutzt werden.
  const handleAnalyzeBpmn = useCallback(async () => {
    if (!modelerRef.current) return;
    try {
      setError(""); // delete any previous error 

      const modeler = modelerRef.current;
      const { xml } = await modeler.saveXML({ format: true });
      const elements  = extractFromXml(xml);
      const result = await analyzeElements(elements, llmProps);
      
      onAnalysisResult?.({
        criticalElements: result.criticalElements ?? [],
        uiMessage: result.uiMessage ?? "",
      });

      console.log("BPMN analysis result:", result);
    } catch (e) {
      console.error("Analyze BPMN failed", e);
      setError("Analyze failed: " + (e?.message ?? ""));
    }
  }, [ onAnalysisResult, llmProps]);



  // --- File import handler: reads selected BPMN file, checks extension, and imports it into the modeler ---
  const handleFileSelected = useCallback(
    async (file) => {
      if (!file) return;
      const name = file.name.toLowerCase();
      if (!name.endsWith(".bpmn") && !name.endsWith(".xml")) {
        setError("Nur .bpmn oder .xml erlaubt");
        return;
      }
      const xml = await file.text();
      await importXmlString(xml);
    }, [importXmlString]);

  // --- Download function: saves the BPMN diagram as an XML file ---
  const handleDownload = useCallback(async () => {
    if (!modelerRef.current) return;
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true }); // BPMN XML save as string
      const blob = new Blob([xml], { type: "application/xml" }); // Binärobjekt, virtual file in memory
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); // temporäre URL
      a.download = "diagram.bpmn"; 
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Download fehlgeschlagen", e);
    }
  }, []);

 // --- CreateNew function: loads new empty Diagram  ---
  const handleCreateNew = useCallback(async () => {
    const modeler = modelerRef.current;
    if(!modeler) return;
    try{
      await modeler.importXML(initialDiagram);
    } catch (error) {
        console.error("Fehler beim Erstellen eines neuen BPMN-Diagramms:", error);
    }
  }, []);

  // --- Clear function: resets colors to default, clearing analysis ---
  const handleClearAnalysis = useCallback(async () => {
    const modeler = modelerRef.current;
    if (!modelerRef.current) return;
    const registry = modeler.get("elementRegistry"); // all elements in diagram, by ID to color them
    const modeling = modeler.get("modeling"); // modeling API to change element styles, colors, etc.
    // ---  Reset: remove old colors ---
    const all = registry.getAll();
    const tasks = all.filter((el) => isTask(el));
    tasks.forEach((el) => { // bpmn-js set default style 
      modeling.setColor(el, { fill: null, stroke: null });
    });
    // clear analysis result in parent state to remove popups and other analysis-related UI
    onAnalysisResult?.(null);
  }, [onAnalysisResult]);

  const handleReportExport = useCallback(async () => {
    if (!analysisResult) {
      setError("Keine Analyseergebnisse zum Exportieren");
      return;
    }
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
      const a = document.createElement("a");
      a.href = dataStr;
      a.download = "analysis_report.json";
      a.click();
    } catch (error) {
      console.error("Report Export fehlgeschlagen", error);
      setError("Report Export fehlgeschlagen: " + (error?.message ?? ""));
    }
  }, [analysisResult]);

  return (
    <BpmnLayout
      containerRef={containerRef}
      fileInputRef={fileInputRef}
      onFileSelected={handleFileSelected}
      onDownload={handleDownload}
      onAnalyze={handleAnalyzeBpmn}
      onCreateNew={handleCreateNew}
      onClear={handleClearAnalysis}
      onReport={handleReportExport}
      error={error}
    />
  );
}

function isTask(el) {
  // deckt Task-Typen ab (bpmn:Task, bpmn:UserTask, bpmn:ServiceTask, ...)
  return (
    el?.type === "bpmn:Task" ||
    el?.type === "bpmn:UserTask" ||
    el?.type === "bpmn:ServiceTask" ||
    el?.type === "bpmn:ManualTask" ||
    el?.type === "bpmn:ScriptTask" ||
    el?.type === "bpmn:SendTask" ||
    el?.type === "bpmn:ReceiveTask"
  );
}
