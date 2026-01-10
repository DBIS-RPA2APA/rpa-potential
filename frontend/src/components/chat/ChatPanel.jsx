import { useCallback, useMemo, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { sendChatMessageMock } from "../../components/llm/llmClient";

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ich bin dein Chatbot (Mock). Schreib mir was",
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
      setIsSending(true);

      try {
        const reply = await sendChatMessageMock(next);
        setMessages([...next, reply]);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending]
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

      <ChatInput onSend={handleSend} disabled={!canSend} />
    </div>
  );
}
