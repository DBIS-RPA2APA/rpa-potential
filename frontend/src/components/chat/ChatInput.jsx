import { useCallback, useState } from "react";
import Button from "../../ui/button";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    onSend(text);
    setText("");
  }, [onSend, text]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!disabled) handleSend();
      }
    },
    [disabled, handleSend]
  );

  return (
    <div className="border-t bg-white p-3">
      <div className="flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nachricht schreiben… (Enter = senden, Shift+Enter = neue Zeile)"
          className="flex-1 text-black resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          rows={3}
        />

        <Button
          color="primary"
          size="small"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
