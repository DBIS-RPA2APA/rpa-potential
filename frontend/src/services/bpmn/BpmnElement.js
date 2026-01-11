// BpmnElement (minimal):
// {
//   id: "Task_1",
//   name: "Check order",
//   documentation: "…",
//   incoming: ["StartEvent_1"],
//   outgoing: ["Task_2"],
//   type: "UserTask"
// }
// - type: String,
// - id: String,
// - name: String? = null,
// - documentation
// - outgoingElement: List<String> = emptyList(),
// - incomingElement: List<String> = emptyList(),
// - outgoingMessageFlowsToElementIds: List<String> = emptyList(),
// - incomingMessageFlowsFromElementIds: List<String> = emptyList(),
// - incomingDataFromElementIds: List<String> = emptyList(),
// - outgoingDataToElementIds: List<String> = emptyList(),
// - associatedElementIds: List<String> = emptyList()
// BpmnElement.js

function BpmnElement(id, name, type, documentation, incoming, outgoing) {
  this.id = id;
  this.name = name;
  this.type = type;
  this.documentation = documentation;
  this.incoming = incoming || [];
  this.outgoing = outgoing || [];
}

export default BpmnElement;