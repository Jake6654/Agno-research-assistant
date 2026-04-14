import ChatHeader from "./chat-header";
import ChatMessageList from "./chat-messages-list";
import ChatEmptyState from "./chat-empty-state";
import ChatInput from "./chat-input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMainProps {
  name: string;
  messages: Message[];
  activeSessionTitle?: string;
  isLoading?: boolean;
  onSubmit: (value: string) => Promise<void> | void;
}

export default function ChatMain({
  name,
  messages,
  activeSessionTitle,
  isLoading = false,
  onSubmit,
}: ChatMainProps) {
  const hasMessages = messages.length > 0;

  return (
    <section className="flex h-full flex-1 flex-col bg-[#fcfcfb]">
      <ChatHeader title={activeSessionTitle || "New Chat"} />

      <div className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <ChatMessageList messages={messages} isLoading={isLoading} />
        ) : (
          <ChatEmptyState name={name} />
        )}
      </div>

      <div className="border-t border-black/8 bg-[#fcfcfb] px-6 py-5">
        <ChatInput onSubmit={onSubmit} disabled={isLoading} />
      </div>
    </section>
  );
}
