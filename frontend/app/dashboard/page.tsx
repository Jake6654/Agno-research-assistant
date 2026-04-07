import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatShell from "@/components/chat/chat-shell";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <ChatShell
      user={user}
      sessions={[
        { id: "1", title: "Serverless LLM pricing", updatedAt: "2h ago" },
        { id: "2", title: "Supabase auth callback", updatedAt: "Yesterday" },
      ]}
      activeSessionTitle="New Chat"
    />
  );
}
