/*
--- Load dataset: handles loading and preparing datasets for evaluation
--- to get TestCases with id, name, bpmnXml, elements, expectedValues
--- extractFromXml to get Task elements from bpmnXml
*/
import { extractFromXml } from "../bpmn/extractFromXml";

// import all BPMN files from the data directory
//"../../data/Dataset1/1 Prüfungsunterlagen.bpmn": "<xml>...</xml>", key=path, value=bpmnxml
const bpmnModules = import.meta.glob("../../data/**/*.bpmn", {
  query: "?raw",
  import: "default",
  eager: true,
});

// import all label files from the data directory
// "../../data/Dataset1/1 Prüfungsunterlagen.labels.json": { name: "1 Prüfungsunterlagen", expectedValues: [...] }, key=path, value=json
const labelModules = import.meta.glob("../../data/**/*.labels.json", {
  import: "default",
  eager: true,
});

// from "data/Dataset1/ProcessA.bpmn" to { datasetName: "Dataset1", fileBaseName: "ProcessA" }
function parsePath(path) {
  const match = path.match(/data\/([^/]+)\/(.+)\.(bpmn|labels\.json)$/);
  if (!match) return null;

  return {
    datasetName: match[1],
    fileBaseName: match[2],
  };
}

export function getAvailableDatasets() {
  const datasetNames = new Set();

  Object.keys(bpmnModules).forEach((path) => {
    const parsed = parsePath(path);
    if (parsed) datasetNames.add(parsed.datasetName);
  });

  return Array.from(datasetNames).sort();
}

export function loadDatasetTestCases(datasetName) {
  const testCases = [];

  const bpmnEntries = Object.entries(bpmnModules).filter(([path]) =>
    path.includes(`/data/${datasetName}/`),
  );

  for (const [bpmnPath, bpmnXml] of bpmnEntries) {
    const parsed = parsePath(bpmnPath);
    if (!parsed) continue;

    const { fileBaseName } = parsed;

    const labelPath = Object.keys(labelModules).find(
      (path) =>
        path.includes(`/data/${datasetName}/`) &&
        path.endsWith(`${fileBaseName}.labels.json`),
    );
    // if labelPath exists…
    const labelData = labelPath ? labelModules[labelPath] : null;

    const elements = extractFromXml(bpmnXml);

    testCases.push({
      id: testCases.length + 1,
      name: fileBaseName,
      datasetId: datasetName,
      bpmnXml,
      elements,
      expectedValues: labelData?.expectedValues ?? [],
    });
  }

  return testCases;
}
