## Next Steps

Today:

- UX überprüfen: History in EvaluationPanel ändern, Logo ändern
- UI Kit-Deign erstellen und anwenden!!! <3
- DarkMode Farben anpassen
- code anpassen

Wednesday

- Related Work neue paper suchen!!!
- UI Kit-Deign

- chatbots generieren bpmn in related work
- schauen wer alles bernad zitiert hat
- aufteilung von related work eher in background
- related work llm in bpmn, rpa umsetzung ähnliches, was wurde noch mit den kriterein gemacht -> pro kategorie 2-3
- mistral

Fragen:

- Genau größe vom Datensatz, Wie viele BPMN muss ich vergleichen -> 10 unterschiedliche größen
- Wie viele LLMs soll ich nehmen und welche? -> 3 Opensource, Kleines, … (siehe Master)
- Wenn eine Task rictiger weiße als automatisierbar eingestuft wurde, ABER die Scorse nicht passen, Was dann? -> Später in Arbeits schreiben…
- Lieber mehr llm Vergleichen, Größeres Datenset, und wiederholungen… -> bei gleichem LLM und gelichem BPMN öfters durchlafuen lassen immer wieder verschiedene Tasks als Automatisierbar eingestuft…

bis 21. Mai:

- Anfangen zu schreiben
- DarkMode Farben anpassen
  (- Tests schreiben)
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

## BPMN Extraction

Input: BPMN XML
Output: BpmnElementList

## LLM Analysis

Input: BpmnElementList + Prompt
Output: BpmnAnalysisResult

- Labeling-Guide / Gold Labels (Evaluation)

## Validation

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

## Backend baut Prompt

## LangChain ruft LLM auf

LangChain übernimmt:
• Prompt bauen
• Modell aufrufen
• Antwort parsen

## Anfrage geht zu OpenRouter

OpenRouter entscheidet:
modelName = mistralai/mistral-7b-instruct -> Anfrage geht an Mistral

## LLM gibt JSON zurück + Backend validiert Ergebnis

## Ergebnis zurück ans Frontend

## BPMN Editor markiert Tasks
