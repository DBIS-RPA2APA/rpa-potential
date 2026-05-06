/*
--- Load dataset: handles loading and preparing datasets for evaluation
--- to get TestCases with id, name, bpmnXml, elements, expectedValues
--- extractFromXml to get Task elements from bpmnXml
*/

import fs from "fs";
import { extractFromXml } from "../bpmn/extractFromXml.js";

const dataFolder = "./src/data";

export function loadDatasetTestCases(datasetName) {
  const datasetFolder = `${dataFolder}/${datasetName}`;

  if (!fs.existsSync(datasetFolder)) return [];

  const files = fs.readdirSync(datasetFolder); // all files in the Dataset (.bpmn, .labels.json)
  const bpmnFiles = files.filter((file) => file.endsWith(".bpmn"));

  const testCases = [];

  for (const bpmnFile of bpmnFiles) {
    const fileBaseName = bpmnFile.replace(".bpmn", "");

    const bpmnFilePath = `${datasetFolder}/${bpmnFile}`;
    const labelFilePath = `${datasetFolder}/${fileBaseName}.labels.json`;

    const bpmnXml = fs.readFileSync(bpmnFilePath, "utf-8");
    const labelContent = fs.existsSync(labelFilePath)
      ? JSON.parse(fs.readFileSync(labelFilePath, "utf-8"))
      : null;

    const elements = extractFromXml(bpmnXml);

    testCases.push({
      id: testCases.length + 1,
      name: fileBaseName,
      datasetId: datasetName,
      bpmnXml,
      elements,
      expectedValues: labelContent?.expectedValues ?? [],
    });
  }

  return testCases;
}
