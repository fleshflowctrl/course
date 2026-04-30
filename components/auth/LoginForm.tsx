"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { createClient } from "@/utils/supabase/client";

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo: redirectToProp }: LoginFormProps) {
  const router = useRouter();
  const redirectTo = safeRedirectPath(redirectToProp, "/course");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signError) {
        setError(signError.message);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1.5 w-full rounded-button border border-divider bg-card px-4 py-3 text-base text-taupe shadow-warm outline-none transition-colors placeholder:text-brown/60 focus:border-brown/40 focus:ring-2 focus:ring-terracotta/25";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="text-sm font-medium text-taupe">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="text-sm font-medium text-taupe">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />
      </div>

      {error ? (
        <p
          className="rounded-button border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
