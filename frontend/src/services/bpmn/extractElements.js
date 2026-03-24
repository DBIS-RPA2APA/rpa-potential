// old version
export function extractElements(modeler) {
  const elements = modeler.get("elementRegistry").getAll();
  const bpmnElements = [];

  elements
    .filter((element) => element.businessObject.$type == "bpmn:Task")
    .forEach((element) => {
      const businessObject = element.businessObject;
      bpmnElements.push({
        id: businessObject.id,
        type: businessObject.$type,
        name: businessObject.name || null,
      });
    });

  return bpmnElements;
}
