"use client";

import { createClient } from "@/lib/supabase/client";

export default function GetStartedButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="rounded-full border border-slate-200/20 bg-slate-100 px-8 py-3 text-sm font-medium text-slate-900 transition hover:scale-[1.02] hover:bg-white"
    >
      Get started
    </button>
  );
}
