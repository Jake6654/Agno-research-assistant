"use client";

interface SessionItem {
  id: string;
  title: string;
  updatedAtLabel: string;
}

interface ChatSidebarProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
    };
  };
  sessions: SessionItem[];
  activeSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  user,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
}: ChatSidebarProps) {
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const initials = name.slice(0, 1).toUpperCase();

  return (
    <aside className="flex h-full w-[290px] flex-col border-r border-black/8 bg-[#f3f3f1]">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-medium text-[#111111]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#111111]">
              {name}
            </p>
            <p className="truncate text-xs text-[#6b7280]">Personal Search</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center rounded-xl bg-[#111111] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          + New Chat
        </button>
      </div>

      <div className="px-3 pb-2">
        <p className="px-2 text-xs font-medium uppercase tracking-wide text-[#8a8f98]">
          Recent chats
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {sessions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-[#8a8f98]">
            No chat sessions yet
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`flex w-full flex-col items-start rounded-xl px-3 py-3 text-left transition hover:bg-white/80 ${
                  activeSessionId === session.id ? "bg-white" : ""
                }`}
              >
                <span className="line-clamp-1 text-sm font-medium text-[#111111]">
                  {session.title}
                </span>
                <span className="mt-1 text-xs text-[#8a8f98]">
                  {session.updatedAtLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-black/8 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f7f7f5] text-sm font-medium text-[#111111]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#111111]">
              {name}
            </p>
            <p className="truncate text-xs text-[#6b7280]">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
