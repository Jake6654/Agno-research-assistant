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
      user={{
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.user_metadata?.full_name,
          name: user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
        },
      }}
    />
  );
}
