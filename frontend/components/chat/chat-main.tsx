import ChatHeader from "./chat-header";
import ChatMessageList from "./chat-messages-list";
import ChatEmptyState from "./chat-empty-state";
import ChatInput from "./chat-input";

interface ChatMainProps {
  name: string;
  activeSessionTitle?: string;
}

export default function ChatMain({ name, activeSessionTitle }: ChatMainProps) {
  const hasMessages = false;

  return (
    <section className="flex h-full flex-1 flex-col bg-[#fcfcfb]">
      <ChatHeader title={activeSessionTitle || "New Chat"} />

      <div className="flex-1 overflow-y-auto">
        {hasMessages ? <ChatMessageList /> : <ChatEmptyState name={name} />}
      </div>

      <div className="border-t border-black/8 bg-[#fcfcfb] px-6 py-5">
        <ChatInput />
      </div>
    </section>
  );
}
