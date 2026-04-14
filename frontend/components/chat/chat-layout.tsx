import type { User } from "@supabase/supabase-js";
import ChatSidebar from "./chat-sidebar";
import ChatMain from "./chat-main";

interface ChatLayoutProps {
  user: User;
  name: string;
}

export default function ChatLayout({ user, name }: ChatLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100">
      <ChatSidebar
        user={user}
        sessions={[]}
        onSelectSession={() => {}}
        onNewChat={() => {}}
      />
      <div className="flex flex-1 flex-col">
        <ChatMain name={name} messages={[]} onSubmit={() => {}} />
      </div>
    </div>
  );
}
