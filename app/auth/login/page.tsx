"use client";

import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("granting user")) {
        setError("Your account has been blocked. Please contact support.");
      } else {
        setError(error.message);
      }
    } else {
      router.push("/admin/users");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} error={error} loading={loading} />
      </div>
    </div>
  );
}
