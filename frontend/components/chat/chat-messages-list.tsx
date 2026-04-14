interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function ChatMessageList({
  messages,
  isLoading = false,
}: ChatMessageListProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.role === "user"
              ? "ml-auto max-w-[80%] rounded-2xl bg-[#111111] px-4 py-3 text-sm text-white"
              : "max-w-[85%] rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm leading-7 text-[#111111]"
          }
        >
          {message.content}
        </div>
      ))}

      {isLoading ? (
        <div className="max-w-[85%] rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-[#6b7280]">
          Thinking...
        </div>
      ) : null}
    </div>
  );
}
