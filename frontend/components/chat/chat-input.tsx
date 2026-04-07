"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

function useAutoResizeTextarea(minHeight: number, maxHeight = 180) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = `${minHeight}px`;
    const nextHeight = Math.min(
      Math.max(el.scrollHeight, minHeight),
      maxHeight
    );
    el.style.height = `${nextHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export default function ChatInput() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea(56, 180);

  const handleSubmit = () => {
    if (!value.trim()) return;
    console.log(value);
    setValue("");
    requestAnimationFrame(() => adjustHeight());
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-[24px] border border-black/10 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask something..."
          className={cn(
            "max-h-[180px] min-h-[56px] w-full resize-none bg-transparent px-1 py-2 text-[15px] text-[#111111] outline-none",
            "placeholder:text-[#9aa0a6]"
          )}
        />

        <div className="mt-3 flex items-center justify-between">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#fafaf9] text-[#6b7280] transition hover:bg-black/[0.03] hover:text-[#111111]">
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={cn(
              "flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition",
              value.trim()
                ? "bg-[#111111] text-white hover:opacity-90"
                : "bg-[#efefec] text-[#a1a1aa]"
            )}
          >
            <span>Send</span>
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
