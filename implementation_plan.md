## Next Steps

Today:

= Panel ProgressBar -> Evaluation
= passed -> kriteren anpassen

- when button "create new" is pressed && neues LLM wird gecallt -> chat history=null
- Button wo die Kriterien (Bernard…) für Automatisierbar stehen im PopUp und Editor!!!
- netzdiagramm und Button bei Diagrammen
- Diagramme relativ zur Bildschirm größe

- repetitions !!! -> von TP,TN; FP; FN Mittelwert nehmen?
- Download Button -> in Evalutaion PopUp, als JSON… Datei EINE Evaluation runterladen kann
- Datensatz 10 Bpmn
- (HoverPopup nach zoom anpassen)

Fragen:

- Genau größe vom Datensatz, Wie viele BPMN muss ich vergleichen -> 10 unterschiedliche größen
- Wie viele LLMs soll ich nehmen und welche? -> 3 Opensource, …
- Wenn eine Task rictiger weiße als automatisierbar eingestuft wurde, ABER die Scorse nicht passen, Was dann? -> Später in Arbeits schreiben…
- Lieber mehr llm Vergleichen, Größeres Datenset, und wiederholungen… -> bei gleichem LLM und gelichem BPMN öfters durchlafuen lassen immer wieder verschiedene Tasks als Automatisierbar eingestuft…

bis 30. April:

- Datensatz 10 Bpmn
- komplette history von results
- repetitions !!!
- Netzdiagramm d3
- Button disabled machen wenn diese ihre Funktion NICHT ausfühern können
- Evaluierung: Button wo die Kriterien für Automatisierbar stehen!!!, Download Button, Panel ProgressBar, mehrere Runs?
- when button "create new" is pressed && neues LLM wird gecallt -> chat history=null
- (HoverPopup nach zoom anpassen)
- UX überprüfen
- Anfangen zu schreiben,

- UI Kit-Deign erstellen und anwenden!!! <3

- deepEval

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

- Frontend: React/ReactNative + bpmn-js (hast du)
- Backend: Node.js
- LLM Layer: LangChain.js
- Provider für Multi-LLM: OpenRouter (plus optional Ollama)
- Output: Zwingend strukturiert + Retry + id-validation (wie Masterarbeit)

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
