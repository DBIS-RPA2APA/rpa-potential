// function get input bpmnXml string and extract all elements from it
// and return them as an array of BpmnElement[] objects
// use DOMParser to parse the XML string and DOMQuery to extract elements
import { DOMParser } from "@xmldom/xmldom";
import BpmnElement from "./BpmnElement.js";

const BPMN_ELEMENT_LOCAL_NAMES = new Set([
  // activities
  "task",
  "userTask",
  "serviceTask",
  "manualTask",
  "scriptTask",
  "sendTask",
  "receiveTask",

  // gateways
  "exclusiveGateway",
  "parallelGateway",
  "inclusiveGateway",
  "eventBasedGateway",

  // events
  "startEvent",
  "endEvent",
  "intermediateCatchEvent",
  "intermediateThrowEvent",
  "boundaryEvent",

  // data
  "dataObjectReference",
  "dataStoreReference",

  // annotation
  "textAnnotation",
]);

export function extractFromXml(bpmnXml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(bpmnXml, "text/xml");

  // Check for parsing errors
  const errorNodes = Array.from(xmlDoc.getElementsByTagName("parsererror"));
  if (errorNodes.length > 0) {
    throw new Error("XML parsing error: " + errorNodes[0].textContent);
  }

  // get all important elements
  const allNodes = Array.from(xmlDoc.getElementsByTagName("*"));
  const taskNodes = allNodes.filter((node) =>
    BPMN_ELEMENT_LOCAL_NAMES.has(node.localName),
  );

  const sequenceFlows = allNodes.filter(
    (node) => node.localName === "sequenceFlow",
  );
  const messageFlows = allNodes.filter(
    (node) => node.localName === "messageFlow",
  );
  const associationFlows = allNodes.filter(
    (node) => node.localName === "association",
  );

  const elements = taskNodes.map((node) => {
    const id = node.getAttribute("id");
    const name = node.getAttribute("name") || null;
    const type = node.localName;
    const documentation = extractDocumentationText(node);

    const poolName = findPoolName(node, xmlDoc);
    const laneName = findLaneName(node, xmlDoc);

    const incomingFlowRefs = getDirectChildContent(node, "incoming");
    const outgoingFlowRefs = getDirectChildContent(node, "outgoing");

    const incomingFlowElementIds = incomingFlowRefs
      .map((flowId) => {
        const flow = sequenceFlows.find((n) => n.getAttribute("id") === flowId);
        return flow?.getAttribute("sourceRef") || null;
      })
      .filter(Boolean);

    const outgoingFlowElementIds = outgoingFlowRefs
      .map((flowId) => {
        const flow = sequenceFlows.find((n) => n.getAttribute("id") === flowId);
        return flow?.getAttribute("targetRef") || null;
      })
      .filter(Boolean);

    const outgoingMessageFlowsToElementIds = messageFlows
      .filter((node) => node.getAttribute("sourceRef") === id)
      .map((node) => node.getAttribute("targetRef"))
      .filter(Boolean);

    const incomingMessageFlowsFromElementIds = messageFlows
      .filter((node) => node.getAttribute("targetRef") === id)
      .map((node) => node.getAttribute("sourceRef"))
      .filter(Boolean);

    const incomingDataFromElementIds = extractIncomingDataFromElementIds(node);
    const outgoingDataToElementIds = extractOutgoingDataToElementIds(node);

    const associatedElementIds = associationFlows
      .filter(
        (assoc) =>
          assoc.getAttribute("sourceRef") === id ||
          assoc.getAttribute("targetRef") === id,
      )
      .map((assoc) => {
        const sourceRef = assoc.getAttribute("sourceRef");
        const targetRef = assoc.getAttribute("targetRef");
        return sourceRef === id ? targetRef : sourceRef;
      })
      .filter(Boolean);

    return new BpmnElement({
      id,
      name,
      type,
      documentation,
      poolName,
      laneName,
      incomingFlowElementIds,
      outgoingFlowElementIds,
      outgoingMessageFlowsToElementIds,
      incomingMessageFlowsFromElementIds,
      incomingDataFromElementIds,
      outgoingDataToElementIds,
      associatedElementIds,
    });
  });
  return elements;
}

// looks for <documentation>…</documentation> child nodes and extracts their text content
function extractDocumentationText(taskNode) {
  const docNodes = Array.from(taskNode.getElementsByTagName("*")).filter(
    (n) => n.localName === "documentation",
  );

  if (docNodes.length === 0) return null;

  const text = docNodes
    .map((n) => (n.textContent || "").trim())
    .filter(Boolean)
    .join("\n");

  return text || null;
}

function findLaneName(taskNode, xmlDoc) {
  const taskId = taskNode.getAttribute("id");
  if (!taskId) return null;
  const allNodes = Array.from(xmlDoc.getElementsByTagName("*"));
  const laneNodes = allNodes.filter((node) => node.localName === "lane");

  for (const laneNode of laneNodes) {
    const flowNodeRef = Array.from(laneNode.getElementsByTagName("*"))
      .filter((n) => n.localName == "flowNodeRef")
      .map((n) => n.textContent.trim());

    if (flowNodeRef.includes(taskId)) {
      return laneNode.getAttribute("name") || null;
    }
  }
  return null;
}

function findPoolName(taskNode, xmlDoc) {
  const processNode = findParentByLocalName(taskNode, "process");
  if (!processNode) return null;

  const processId = processNode.getAttribute("id");
  if (!processId) return null;

  const allNodes = Array.from(xmlDoc.getElementsByTagName("*"));
  const particNodes = allNodes.filter((n) => n.localName === "participant");

  const partic = particNodes.find(
    (n) => n.getAttribute("processRef") === processId,
  );

  return partic?.getAttribute("name") || null;
}

function findParentByLocalName(node, localName) {
  let current = node.parentNode;
  while (current) {
    if (current.localName === localName) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

// get text content of direct child elements with a specific local name
function getDirectChildContent(node, localName) {
  return Array.from(node.childNodes)
    .filter((child) => child.localName === localName)
    .map((child) => (child.textContent || "").trim())
    .filter(Boolean);
}

function extractIncomingDataFromElementIds(taskNode) {
  const dataInput = Array.from(taskNode.childNodes).filter(
    (n) => n.localName === "dataInputAssociation",
  );

  return dataInput.flatMap((assoc) =>
    Array.from(assoc.childNodes)
      .filter((n) => n.localName === "sourceRef")
      .map((n) => n.textContent.trim())
      .filter(Boolean),
  );
}

function extractOutgoingDataToElementIds(taskNode) {
  const dataOutput = Array.from(taskNode.childNodes).filter(
    (n) => n.localName === "dataOutputAssociation",
  );
  return dataOutput.flatMap((assoc) =>
    Array.from(assoc.childNodes)
      .filter((n) => n.localName === "targetRef")
      .map((n) => n.textContent.trim())
      .filter(Boolean),
  );
}
