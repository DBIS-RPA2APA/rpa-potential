import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);
  //bg-[#FFF4EE]
  return (
    <div className="flex-1 min-h-0 overflow-auto px-2 pb-2 pt-20">
      <div className="flex flex-col gap-3">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          const content =
            typeof m.content === "string" ? m.content : String(m.content ?? "");
          return (
            <div
              key={idx}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap wrap-break-word ${
                isUser
                  ? "ml-auto bg-[#0B172D] text-white"
                  : "mr-auto bg-[#FFF4EE] text-[#0B172D]"
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
