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

function BpmnElement({
  type,
  id,
  name = null,
  documentation = null,
  poolName = null, // pool is the container of lanes, in a pool there can be lanes and tasks
  laneName = null, // lane is the container of tasks, in a lane there can be tasks but no lanes

  incomingFlowElementIds = [], // sequence flows, e.g. from Task_1 to Task_2
  outgoingFlowElementIds = [],

  outgoingMessageFlowsToElementIds = [], // message flows, e.g. from Task_1 to an external participant
  incomingMessageFlowsFromElementIds = [],

  incomingDataFromElementIds = [], // data associations, e.g. from a data object to a task
  outgoingDataToElementIds = [],

  associatedElementIds = [],
}) {
  this.type = type;
  this.id = id;
  this.name = name;
  this.documentation = documentation;
  this.poolName = poolName;
  this.laneName = laneName;

  this.incomingFlowElementIds = incomingFlowElementIds;
  this.outgoingFlowElementIds = outgoingFlowElementIds;

  this.outgoingMessageFlowsToElementIds = outgoingMessageFlowsToElementIds;
  this.incomingMessageFlowsFromElementIds = incomingMessageFlowsFromElementIds;

  this.incomingDataFromElementIds = incomingDataFromElementIds;
  this.outgoingDataToElementIds = outgoingDataToElementIds;

  this.associatedElementIds = associatedElementIds;
}

export default BpmnElement;
