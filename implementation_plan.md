## Next Steps

Fragen:

- Genau größe vom Datensatz, Wie viele BPMN muss ich vergleichen
- Wie viele LLMs soll ich nehmen und welche?
- A/B-Vergleich von Algorithmen. Gegenüberstellung verschiedener Klassifizierungspipelines, mit z. B. alternativen Prompts oder anderem Preprocessing, über eine standardisierte HTTP-Schnittstelle, die in Kapitel 4.4 definiert ist. -> Muss ich das auch machen? im Master nicht gemacht, nur Fokus auf demselben Algorithmus!
- Wenn eine Task rictiger weiße als automatisierbar eingestuft wurde, ABER die Scorse nicht passen, Was dann?

bis 9. April:

data class EvaluationMetadataReport(
val modelName: String,
val modelTemperature: Double,
val modelTopP: Double,
val dataset: String,
val totalTestCases: Int,
val defaultEvaluationEndpoint: String,
val totalRepetitions: Int = 1,
val seed: Int? = null,
val timestamp: Timestamp,
)

data class EvaluationReportSummary(
val total: Int,
val passed: Int,
val failed: Int,
val error: Int,
val amountOfRetries: Int? = null,
val precision: Double,
val recall: Double,
val f1Score: Double,
val accuracy: Double,
val totalTruePositives: Int,
val totalFalsePositives: Int,
val totalFalseNegatives: Int,
val totalTrueNegatives: Int
)
data class TestCaseReport(
val testCaseId: Long,
val testCaseName: String? = null,
val datasetId: Long? = null,
val imageSrc: String,
val correctActivityIds: List<String>,
val falsePositiveIds: List<String>,
val falseNegativeIds: List<String>,
val expectedNamesWithIds: List<String>,
val actualNamesWithIds: List<String>,
val isSuccessful: Boolean,
val result: List<ExpectedValue>,
val amountOfRetries: Int? = null
)

- deepEval
- mertendieckmann/griplbackend/evaluation/metrics/MetricsAccumulator.kt
- Aufbau Evaluierung: Diagramm erstellen lassen, Score pro Task in Tabelle einfügen, Button wo die Kriterien für Automatisierbar stehen!!!
- schon durchgeführte Evluierungen können nochmal aufgerufen werden…
- Labeling: für jede Avtivität (id, automatiseirbar (true, false), Scores), als JSON (frontend/components/labeling/…)

ToDo:

- ganzes Datenset mitgeben dass Analyseirt werden soll, wenn dass analysiert wurde je ein BPMN auswählen und sich im Editor anzeigen lass mit resaon… -> im Evaluation Tab!!!
- Evaluation der verschiedenen LLMs !!!
- Download Evaluation Button!!!

- when button "create new" is pressed && neues LLM wird gecallt -> chat history=null
- BPMNEditor evtl functions auslagern
- Button disabled machen wenn diese ihre Funktion NICHT ausfühern können
- (HoverPopup nach zoom anpassen)
- UX überprüfen
- UI Kit-Deign erstellen und anwenden!!! <3

## Goal:

Input: BPMN as XML in BpmnElementList as JSON-Array umgewandelt an SystemPrompt angehängt
Output: BpmnAnalysisResult -> Liste mit kritischen Elementen, in Editor Bpmn angezeigt

## Steps:

1. Bpmn in Editor laden
2. Mit "Extract Tasks" Button Tasks (Elemente) extrahieren in BpmnElementListe
3. BpmnElementListe wird in Chat Input angezeigt
4. UserPrompt und SystemPromt mit "Send" Button im Chat an LLM gesendet
5. Im Chat bekommt man ResultListe zurück und Bpmn wird im Ediot gezeigt mit rot eingefärbten Tasks
6. ...
7. Evalation der verschiedenen LLMs !!!

React Native App
↓
Node Backend
↓
LangChain.js
↓
OpenRouter API
↓
LLMs

- Frontend: React/ReactNative + bpmn-js (hast du)
- Backend: Node.js
- LLM Layer: LangChain.js
- Provider für Multi-LLM: OpenRouter (plus optional Ollama)
- Output: Zwingend strukturiert + Retry + id-validation (wie Masterarbeit)

## Offene Fragen...

- Daten Labeln für Evaluation zw verschiedenen LLMs
- Datenset erstellen/ holen…
- Camunda informieren
- Fehlerhafte LLM-Antworten abfangen
- llmProps (Modelname, temperature, topP, seed etc.) -> im Frontend selber setztn können (PopUp/…)
- BPMN im Editor interaktiv (Begründungen vom LLM anzeigen)

## BPMN Extraction

Input: BPMN XML
Output: BpmnElementList

## LLM Analysis

Input: BpmnElementList + Prompt
Output: BpmnAnalysisResult

- Labeling-Guide / Gold Labels (Evaluation)

## Validation / Guardrails

Input: rohe LLM-Antwort
Output: valides BpmnAnalysisResult

1. Antwort muss JSON nach Schema sein
2. Wenn Parsing/Schema fail → Retry mit Fehlermeldung (z.B. max 3) ￼
3. IDs validieren: nur elementIds, die wirklich existieren (und ggf. vervollständigen) ￼
4. Duplikate raus

## BPMN Visualization

Input: BpmnAnalysisResult
Output: Editor mit rot markierten Elementen

## OpenRouter

- Model Zugriff
- OpenRouter kein eigener LLM -> ein Gateway / Routing Service
- liefert Zugriff auf viele LLMs

# Mit Evaluationskonfiguration Config-Pattern:

llmProps = {
baseUrl: "https://openrouter.ai/api/v1",
modelName: "mistralai/mistral-7b-instruct",
apiKey: "...",
temperature: 0.1,
topP: 1,
seed: 123
}

## LangChain

- orchestriert Prompts / structured output
- Output parsen
- Pipelines bauen
- LangChain sitzt zw Backend und LLMs

  • ChatPromptTemplate baut den Prompt
  • ChatOpenAI ruft das Modell auf
  • withStructuredOutput() erzwingt JSON
  • invoke() schickt alles weg

### Ablauf

## Anfrage an Backend

Frontend sendet:  
POST /analysis
{
"bpmnElements": [...],
"llmProps": {
"modelName": "mistralai/mistral-7b-instruct",
"temperature": 0.1
}
}

## Backend baut Prompt

Backend baut: System Prompt
You are an expert in business process automation.
Identify tasks that are automatable.
Return only JSON.

Format:
{
"automatableTasks": [
{ "id": "...", "reason": "..." }
]
}

## User Prompt

LangChain bekommt:
[
{
"id": "Task_1",
"name": "Check customer data"
},
{
"id": "Task_2",
"name": "Send email"
}
]

## LangChain ruft LLM auf

LangChain übernimmt:
• Prompt bauen
• Modell aufrufen
• Antwort parsen

## Anfrage geht zu OpenRouter

OpenRouter entscheidet:
modelName = mistralai/mistral-7b-instruct -> ANfrage geht an Mistral

## LLM gibt JSON zurück + Backend validiert Ergebnis

wie in der Masterarbeit:
Backend prüft:
• JSON valid?
• id existiert?
• keine Duplikate?

## Ergebnis zurück ans Frontend

## BPMN Editor markiert Tasks
