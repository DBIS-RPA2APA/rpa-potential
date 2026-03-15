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
  llmProps,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ich bin dein Chatbot. Schreib mir was",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const canSend = useMemo(() => !isSending, [isSending]);

  // --- Send handler: sends user message, calls analysis API if preparedRequest is set, 
  // and updates chat messages with response ---
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
          const result = await analyzeElements(preparedRequest.elements, llmProps);

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
                'Please use the "Extract" button to analyze the BPMN diagram first. Then send your message again.',
            },
          ]);
        }
      } catch (err) {
        console.error("Error during analysis:", err);
        setMessages([
          ...next,
          {
            role: "assistant",
            content: `Error during analysis: ${err.message}`,
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
