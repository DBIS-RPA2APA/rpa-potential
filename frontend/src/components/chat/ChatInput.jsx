import { useCallback } from "react";
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
    [disabled, handleSend],
  );

  return (
    <div className="bg-[#DFE5F5]/70 p-4">
      <div className="flex gap-2 items-end">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Send a message…"
          className="flex-1 h-30 bg-white/35 text-black resize-none rounded-2xl border-2 border-[#425176] px-3 py-2 text-md outline-none focus:ring-2 focus:ring-slate-300"
          rows={4}
        />

        <Button
          color="thirdary"
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
