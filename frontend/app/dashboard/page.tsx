import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatLayout from "@/components/chat/chat-layout";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Extract name safely
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return <ChatLayout user={user} name={name} />;
}
