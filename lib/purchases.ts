import type { SupabaseClient } from "@supabase/supabase-js";

export type PurchaseRow = {
  stripe_checkout_session_id: string;
  email: string;
  amount_total: number | null;
  currency: string | null;
  user_id: string | null;
  signup_completed_at: string | null;
  created_at: string;
};

/** Insert from Stripe; safe if webhook + API race (unique session id). */
export async function insertPurchaseFromCheckout(
  admin: SupabaseClient,
  row: Pick<PurchaseRow, "stripe_checkout_session_id" | "email" | "amount_total" | "currency">,
): Promise<void> {
  const { error } = await admin.from("purchases").insert({
    stripe_checkout_session_id: row.stripe_checkout_session_id,
    email: row.email,
    amount_total: row.amount_total ?? 0,
    currency: row.currency ?? "eur",
  });

  if (
    error?.code === "23505" ||
    /duplicate key|unique constraint/i.test(error?.message ?? "")
  ) {
    return;
  }
  if (error) throw error;
}

export async function getPurchaseSignupState(
  admin: SupabaseClient,
  stripeCheckoutSessionId: string,
): Promise<{ signup_completed_at: string | null; user_id: string | null } | null> {
  const { data, error } = await admin
    .from("purchases")
    .select("signup_completed_at, user_id")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function markPurchaseSignupComplete(
  admin: SupabaseClient,
  stripeCheckoutSessionId: string,
  userId: string,
): Promise<void> {
  const { error } = await admin
    .from("purchases")
    .update({
      user_id: userId,
      signup_completed_at: new Date().toISOString(),
    })
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId);

  if (error) throw error;
}
