import { useEffect, useRef, useCallback, useState } from "react";

import BpmnModeler from "bpmn-js/lib/Modeler";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "../../styles/bpmn-style/bpmn.css";

import initialDiagram from "../../data/empty.bpmn?raw";
import { BpmnLayout } from "./BpmnLayout.jsx";
import { extractFromXml } from "../../services/bpmn/extractFromXml.js";
import { preparePromptPreview } from "../../services/bpmn/preparePromptPreview.js";

export function BpmnEditor({ setChatText }) {
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

      const { preview } = await preparePromptPreview(modelerRef.current);

      setChatText(preview); // schreibt direkt ins Chat-Input
    } catch (e) {
      console.error("Extract failed", e);
      setError("Extract fehlgeschlagen: " + (e?.message ?? ""));
    }
  }, [setChatText]);

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
