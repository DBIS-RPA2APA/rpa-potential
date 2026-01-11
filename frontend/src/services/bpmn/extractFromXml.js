// function should get an input bpmnXml string and extract all elements from it
// and return them as an array of BpmnElement[] objects
// use DOMParser to parse the XML string and DOMQuery to extract elements

import BpmnElement from './BpmnElement';

const TASK_LOCAL_NAMES = new Set([
  "task",
  "userTask",
  "serviceTask",
  "manualTask",
  "scriptTask",
  "sendTask",
  "receiveTask",
]);


export function extractFromXml(bpmnXml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(bpmnXml, "text/xml");

    // Check for parsing errors
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
        throw new Error('XML parsing error: ' + errorNode.textContent);
    }


  // get all task elements
    const allNodes = Array.from(xmlDoc.getElementsByTagName("*"));
    const taskNodes = allNodes.filter((node) => TASK_LOCAL_NAMES.has(node.localName));
        
    const elements = taskNodes.map((node) => {
        const id = node.getAttribute("id");
        const name = node.getAttribute("name") || null;

        // type im Stil der Masterarbeit: "bpmn:userTask" oder nur "userTask"
        const type = node.localName;

        // Dokumentation (optional) – nur wenn vorhanden
        const documentation = extractDocumentationText(node);

        return new BpmnElement(id, name, type, documentation, [], []);
    });
    return elements;
}

// looks for <documentation>…</documentation> child nodes and extracts their text content,
// its important to note that there can be multiple documentation nodes, we concatenate their text content with newlines
function extractDocumentationText(taskNode) {
  const docNodes = Array.from(taskNode.getElementsByTagName("*")).filter(
    (n) => n.localName === "documentation"
  );

  if (docNodes.length === 0) return null;

  const text = docNodes
    .map((n) => (n.textContent || "").trim())
    .filter(Boolean)
    .join("\n");

  return text || null;
}