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

BpmnElement = {
  id: string,
  name: string | null,
  type: string,
  documentation: string | null,
  incoming: string[any],
  outgoing: string[any],
}
export default BpmnElement;