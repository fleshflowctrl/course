"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

type Props = {
  sessionId: string;
  email: string;
};

export function PurchaseSignupForm({ sessionId, email }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass =
    "mt-1.5 w-full rounded-button border border-divider bg-card px-4 py-3 text-base text-taupe shadow-warm outline-none transition-colors placeholder:text-brown/60 focus:border-brown/40 focus:ring-2 focus:ring-terracotta/25";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/complete-purchase-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, password }),
      });
      const data = (await res.json()) as {
        error?: string | Record<string, string[]>;
        code?: string;
        email?: string;
      };

      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Could not create your account.";
        throw new Error(msg);
      }

      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signError) {
        setError(
          "Account created but automatic sign-in failed. Use Log in with the same email and password.",
        );
        setLoading(false);
        return;
      }

      router.push("/course");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="purchase-email" className="text-sm font-medium text-taupe">
          Email (from your payment)
        </label>
        <input
          id="purchase-email"
          type="email"
          readOnly
          value={email}
          className={`${fieldClass} bg-beige/40 text-brown`}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="purchase-password" className="text-sm font-medium text-taupe">
          Choose a password
        </label>
        <input
          id="purchase-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="purchase-confirm" className="text-sm font-medium text-taupe">
          Confirm password
        </label>
        <input
          id="purchase-confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldClass}
        />
      </div>

      {error ? (
        <p
          className="rounded-button border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}{" "}
          {error.includes("already exists") ? (
            <Link
              href={`/login?redirectTo=${encodeURIComponent("/course")}`}
              className="font-semibold underline underline-offset-2"
            >
              Go to log in
            </Link>
          ) : null}
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
        {loading ? "Creating your account…" : "Create account & go to lessons"}
      </Button>

      <p className="text-center text-sm text-brown">
        Already have an account?{" "}
        <Link
          href={`/login?redirectTo=${encodeURIComponent("/course")}`}
          className="font-medium text-terracotta underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
