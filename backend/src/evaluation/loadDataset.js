/*
--- Load dataset: handles loading and preparing datasets for evaluation
--- to get TestCases with id, name, bpmnXml, elements, expectedValues
--- extractFromXml to get Task elements from bpmnXml
*/

import fs from "fs";
import { extractFromXml } from "../bpmn/extractFromXml.js";

const dataFolder = "./src/data";

// Docker setup: exactly one dataset is mounted at DATASET_DIR (./dataset on the
// host). It is evaluated regardless of the dataset name sent by the frontend and
// labelled with DATASET_NAME (default "dataset") in run logs and history.
export function resolveDataset(datasetName) {
  if (process.env.DATASET_DIR) {
    return {
      name: process.env.DATASET_NAME || "dataset",
      folder: process.env.DATASET_DIR,
    };
  }
  return { name: datasetName, folder: `${dataFolder}/${datasetName}` };
}

// names of the datasets that can be selected in the frontend
export function listDatasets() {
  if (process.env.DATASET_DIR) {
    return [process.env.DATASET_NAME || "dataset"];
  }
  if (!fs.existsSync(dataFolder)) return [];
  return fs
    .readdirSync(dataFolder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && !name.includes("excluded"))
    .sort();
}

// Optional dataset settings in <dataset folder>/dataset.json, e.g.
// { "inputMode": "labelsOnly" } for an ablation dataset. They take precedence
// over environment variables, values sent with the request over both.
export function loadDatasetConfig(datasetName) {
  const { folder } = resolveDataset(datasetName);
  const file = `${folder}/dataset.json`;
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (error) {
    console.warn(`Could not read ${file}:`, error.message);
    return {};
  }
}

export function loadDatasetTestCases(datasetName) {
  const { name, folder: datasetFolder } = resolveDataset(datasetName);

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
      datasetId: name,
      bpmnXml,
      elements,
      expectedValues: labelContent?.expectedValues ?? [],
    });
  }

  return testCases;
}
