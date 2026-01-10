import { useEffect, useRef } from "react";

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-auto p-4 bg-slate-50">
      <div className="flex flex-col gap-3">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                isUser
                  ? "ml-auto bg-slate-900 text-white"
                  : "mr-auto bg-white border text-slate-900"
              }`}
            >
              {m.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
