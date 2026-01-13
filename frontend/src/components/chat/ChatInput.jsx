import { useCallback, useState } from "react";
import Button from "../../ui/button";

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const handleSend = useCallback(() => {
    onSend?.(value);
    onChange("");
  }, [onSend, value, onChange]);

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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nachricht schreiben…"
          className="flex-1 text-black resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          rows={4}
        />

        <Button
          color="primary"
          size="small"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
