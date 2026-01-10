## Services

- macht Umwandlungen / Logik / Calls
- Logik / Datenverarbeitung KEINE UI
- Daten umwandeln / parsen / validieren / bauen

## Infos pro Aktivität

- type: String,
- id: String,
- name: String? = null,
- documentation
- outgoingElement: List<String> = emptyList(),
- incomingElement: List<String> = emptyList(),
- outgoingMessageFlowsToElementIds: List<String> = emptyList(),
- incomingMessageFlowsFromElementIds: List<String> = emptyList(),
- incomingDataFromElementIds: List<String> = emptyList(),
- outgoingDataToElementIds: List<String> = emptyList(),
- associatedElementIds: List<String> = emptyList()
