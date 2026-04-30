/**
 * Checkout CTA clicks — extend after cookie consent (GA4, Meta, TikTok).
 * Fires before navigation so attribution is not lost.
 */
export function trackCheckoutClick(source: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("marketing:checkout_click", { detail: { source } }),
  );
}
