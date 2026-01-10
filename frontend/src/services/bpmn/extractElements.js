// BPMN is split into individual BPMNElements[]

// function extractElements(modeler) -> mit Console.log alle Elemente aus dem BPMN Modeler 
// extrahieren und in einem Array zurückgeben
// 
// Contract (BpmnElement):
// { id, type, name }

export function extractElements(modeler) {
  // TODO alle Elemente aus dem BPMN Modeler extrahieren und in einem Array zurückgeben
  const elements = modeler.get('elementRegistry').getAll();
  const bpmnElements = [];

  elements.filter(element => element.businessObject.$type == "bpmn:Task").
  forEach(element => {
    const businessObject = element.businessObject;
    bpmnElements.push({
      id: businessObject.id,
      type: businessObject.$type,
      name: businessObject.name || null,
    });
  });

  return bpmnElements;
}