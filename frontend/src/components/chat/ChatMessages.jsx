import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-auto p-2 bg-slate-50">
      <div className="flex flex-col gap-3">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          const content =
            typeof m.content === "string" ? m.content : String(m.content ?? "");
          return (
            <div
              key={idx}
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap wrap-break-word ${
                isUser
                  ? "ml-auto bg-slate-900 text-white"
                  : "mr-auto bg-white border text-slate-900"
              }`}
            >
              {isUser ? (
                <span className="whitespace-pre-wrap">{content}</span>
              ) : (
                <ReactMarkdown>{content}</ReactMarkdown>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
