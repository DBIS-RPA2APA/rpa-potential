import { useCallback, useMemo, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { analyzeElements } from "../../services/api/analyzeApi.js";

export default function ChatPanel({
  chatText,
  setChatText,
  preparedRequest,
  setPreparedRequest,
  onAnalysisResult,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ich bin dein Chatbot. Schreib mir was",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const canSend = useMemo(() => !isSending, [isSending]);

  const handleSend = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const next = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setChatText("");
      setIsSending(true);

      try {
        if (preparedRequest?.elements?.length) {
          const result = await analyzeElements(preparedRequest.elements, {
                baseUrl: "https://openrouter.ai/api/v1",
                modelName: "openai/gpt-4o-mini",
                temperature: 0.7,
                topP: 1,
              });

          setMessages([
            ...next,
            {
              role: "assistant",
              content:
                result.uiMessage ||
                `Analysis finished with model: ${result?.meta?.model ?? "unknown"}`,
            },
          ]);

          onAnalysisResult?.({ criticalElements: result.criticalElements });
          setPreparedRequest(null);
          return;
        } else {
          setMessages([
            ...next,
            {
              role: "assistant",
              content:
                'Bitte den Button "Extract Tasks" zu nutzen, um eine Analyse durchzuführen.',
            },
          ]);
        }
      } catch (err) {
        console.error("Error during analysis:", err);
        setMessages([
          ...next,
          {
            role: "assistant",
            content: `Fehler bei der Analyse: ${err.message}`,
          },
        ]);

        onAnalysisResult?.({ criticalElements: [] });
      }finally {
        setIsSending(false);
      }
    },
    [
      messages,
      isSending,
      setChatText,
      preparedRequest,
      setPreparedRequest,
      onAnalysisResult,
    ]
  );

  const handleClear = useCallback(() => {
    setMessages([
      { role: "assistant", content: "Chat geleert. Schreib mir was" },
    ]);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow border overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900">Chat</div>
          <div className="text-xs text-slate-500">Mock – später LLM/API</div>
        </div>

        <button
          onClick={handleClear}
          className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          Clear
        </button>
      </div>

      <ChatMessages messages={messages} />

      <ChatInput
        value={chatText}
        onChange={setChatText}
        onSend={handleSend}
        disabled={!canSend}
      />
    </div>
  );
}
