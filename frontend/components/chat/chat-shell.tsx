import ChatSidebar from "./chat-sidebar";
import ChatMain from "./chat-main";

interface ChatShellProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
    };
  };
  sessions?: {
    id: string;
    title: string;
    updatedAt: string;
  }[];
  activeSessionTitle?: string;
}

export default function ChatShell({
  user,
  sessions = [],
  activeSessionTitle,
}: ChatShellProps) {
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="h-screen w-full bg-[#f7f7f5] p-3">
      <div className="flex h-full w-full overflow-hidden rounded-3xl border border-black/10 bg-[#fcfcfb]">
        <ChatSidebar user={user} sessions={sessions} />
        <ChatMain name={name} activeSessionTitle={activeSessionTitle} />
      </div>
    </div>
  );
}
