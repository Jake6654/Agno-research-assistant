"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ChatSidebar from "./chat-sidebar";
import ChatMain from "./chat-main";
import { askResearch } from "@/lib/api/research";

interface ChatUser {
  id?: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

interface ChatShellProps {
  user: ChatUser;
}

const STORAGE_PREFIX = "agno-chat-sessions";

function getStorageKey(user: ChatUser) {
  return `${STORAGE_PREFIX}:${user.id || user.email || "anon"}`;
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function formatUpdatedAtLabel(updatedAt: string) {
  const now = Date.now();
  const then = new Date(updatedAt).getTime();
  const diffMs = Math.max(0, now - then);
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(updatedAt).toLocaleDateString();
}

export default function ChatShell({ user }: ChatShellProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const storageKey = useMemo(() => getStorageKey(user), [user]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        sessions: ChatSession[];
        activeSessionId: string | null;
      };

      if (Array.isArray(parsed.sessions)) {
        setSessions(parsed.sessions);
      }
      if (parsed.activeSessionId) {
        setActiveSessionId(parsed.activeSessionId);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        sessions,
        activeSessionId,
      })
    );
  }, [activeSessionId, sessions, storageKey]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [activeSessionId, sessions]
  );

  const createEmptySession = useCallback(() => {
    const newSession: ChatSession = {
      id: createId("session"),
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const handleNewChat = useCallback(() => {
    createEmptySession();
  }, [createEmptySession]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: createId("msg"),
        role: "user",
        content,
      };

      const targetSession = activeSession ?? createEmptySession();
      const now = new Date().toISOString();

      setSessions((prev) =>
        prev
          .map((session) => {
            if (session.id !== targetSession.id) return session;
            return {
              ...session,
              title:
                session.messages.length === 0
                  ? content.slice(0, 50)
                  : session.title,
              updatedAt: now,
              messages: [...session.messages, userMessage],
            };
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );

      setActiveSessionId(targetSession.id);
      setIsLoading(true);

      try {
        const response = await askResearch({
          question: content,
          user_id: user.id,
          session_id: targetSession.id,
        });

        const assistantMessage: ChatMessage = {
          id: createId("msg"),
          role: "assistant",
          content: response.response,
        };

        const updatedNow = new Date().toISOString();

        setSessions((prev) =>
          prev
            .map((session) => {
              if (session.id !== targetSession.id) return session;
              return {
                ...session,
                updatedAt: updatedNow,
                messages: [...session.messages, assistantMessage],
              };
            })
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
        );
      } catch (error) {
        const fallbackMessage: ChatMessage = {
          id: createId("msg"),
          role: "assistant",
          content:
            error instanceof Error
              ? `Request failed: ${error.message}`
              : "Request failed. Please try again.",
        };

        const updatedNow = new Date().toISOString();

        setSessions((prev) =>
          prev
            .map((session) => {
              if (session.id !== targetSession.id) return session;
              return {
                ...session,
                updatedAt: updatedNow,
                messages: [...session.messages, fallbackMessage],
              };
            })
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSession, createEmptySession, user.id]
  );

  const sessionsForSidebar = useMemo(
    () =>
      sessions.map((session) => ({
        id: session.id,
        title: session.title,
        updatedAtLabel: formatUpdatedAtLabel(session.updatedAt),
      })),
    [sessions]
  );

  return (
    <div className="h-screen w-full bg-[#f7f7f5] p-3">
      <div className="flex h-full w-full overflow-hidden rounded-3xl border border-black/10 bg-[#fcfcfb]">
        <ChatSidebar
          user={user}
          sessions={sessionsForSidebar}
          activeSessionId={activeSessionId ?? undefined}
          onSelectSession={setActiveSessionId}
          onNewChat={handleNewChat}
        />
        <ChatMain
          name={name}
          activeSessionTitle={activeSession?.title ?? "New Chat"}
          messages={activeSession?.messages ?? []}
          isLoading={isLoading}
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
}
