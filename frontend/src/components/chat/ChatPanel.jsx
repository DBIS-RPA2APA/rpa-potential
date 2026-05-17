import { useCallback, useMemo, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { chatMessage } from "../../services/api/analyzeApi";
import { useEffect } from "react";

export default function ChatPanel({
  chatText,
  setChatText,
  hasAnalysis,
  analysisResult,
  llmProps,
  resetToken,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! I'm your chatbot. Send me a message! But first click 'Analyze BPMN' to start the analysis.",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const canSend = useMemo(() => !isSending, [isSending]);

  useEffect(() => {
    if (!analysisResult) return;

    setMessages([
      {
        role: "assistant",
        content:
          analysisResult.uiMessage ||
          "Analysis is complete. You can now ask questions about it.",
      },
    ]);
  }, [analysisResult]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hey! I'm your chatbot. Send me a message! But first click 'Analyze BPMN' to start the analysis.",
      },
    ]);
    setChatText("");
  }, [resetToken, setChatText]);

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
        if (!hasAnalysis) {
          setMessages([
            ...next,
            {
              role: "assistant",
              content:
                'Please use the "Analyze BPMN" button in the BPMN toolbar to run the analysis.',
            },
          ]);
          return;
        }
        const result = await chatMessage(trimmed, llmProps);
        setMessages([
          ...next,
          {
            role: "assistant",
            content: result.message || "Haven`t received a reply from llm.",
          },
        ]);
      } catch (err) {
        console.error("Error during chat:", err);
        setMessages([
          ...next,
          {
            role: "assistant",
            content: `Error: ${err.message}`,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending, setChatText, llmProps, hasAnalysis],
  );

  const handleClear = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: hasAnalysis
          ? "Chat cleared. You can continue asking about the current analysis."
          : "Chat cleared. Click 'Analyze BPMN' to start a new analysis.",
      },
    ]);
    setChatText("");
  }, [hasAnalysis, setChatText]);

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between bg-[#DFE5F5]/70  backdrop-blur-xl border-b border-white/20 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">LLM</h2>
          <div className="text-xs text-slate-500">
            {llmProps?.modelName || "Unknown Model"}
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-sm text-slate-900 hover:underline cursor-pointer"
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
