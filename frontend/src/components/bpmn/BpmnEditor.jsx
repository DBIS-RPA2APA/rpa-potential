import { useEffect, useRef, useCallback, useState } from "react";

import BpmnModeler from "bpmn-js/lib/Modeler";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "../../styles/bpmn-style/bpmn.css";

import initialDiagram from "../../data/empty.bpmn?raw";
import { BpmnLayout } from "./BpmnLayout.jsx";
import { preparePromptPreview } from "../../services/bpmn/preparePrompt.js";

export function BpmnEditor({
  setChatText,
  setPreparedRequest,
  analysisResult,
}) {
  const containerRef = useRef(null);
  const modelerRef = useRef(null);
  const fileInputRef = useRef(null); // ref um den Datei-Input zu referenzieren also
  // wenn man auf "Upload BPMN" klickt

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
    const registry = modeler.get("elementRegistry");
    const modeling = modeler.get("modeling");

    // ---  Reset: alte Farben entfernen ---
    const all = registry.getAll();
    const tasks = all.filter((el) => isTask(el));

    tasks.forEach((el) => {
      // bpmn-js setzt default style wieder
      modeling.setColor(el, { fill: null, stroke: null });
    });

    // --- Kritische Elemente einfärben ---
    analysisResult.criticalElements.forEach((crit) => {
      const el = registry.get(crit.id);
      if (!el) {
        console.warn("Element nicht im Diagramm gefunden:", crit.id);
        return;
      }

      // Farben setzen
      modeling.setColor(el, { fill: "#FEE2E2", stroke: "#DC2626" });
    });
    console.log(
      "critical:",
      analysisResult.criticalElements.map((x) => x.id)
    );
    console.log(
      "registry ids:",
      modelerRef.current
        .get("elementRegistry")
        .getAll()
        .map((x) => x.id)
    );
  }, [analysisResult]);

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

  const handleExtract = useCallback(async () => {
    if (!modelerRef.current) return;
    try {
      setError("");

      const { previewText, elements } = await preparePromptPreview(
        modelerRef.current
      );
      setChatText(previewText); // schreibt direkt ins Chat-Input
      setPreparedRequest({ elements });

      console.log("Extracted elements:", elements);
    } catch (e) {
      console.error("Extract failed", e);
      setError("Extract fehlgeschlagen: " + (e?.message ?? ""));
    }
  }, [setChatText, setPreparedRequest]);

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
    },
    [importXmlString]
  );

  const handleDownload = useCallback(async () => {
    if (!modelerRef.current) return;
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true }); // BPMN XML als String speichern
      const blob = new Blob([xml], { type: "application/xml" }); // Binärobjekt, erzeugst eine virtuelle Datei im Speicher, erzeugst eine temporäre URL dafür
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); // temporäre URL
      a.download = "diagram.bpmn"; // Dateiname
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Download fehlgeschlagen", e);
    }
  }, []);

  return (
    <BpmnLayout
      containerRef={containerRef}
      fileInputRef={fileInputRef}
      onFileSelected={handleFileSelected}
      onDownload={handleDownload}
      onExtract={handleExtract}
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
