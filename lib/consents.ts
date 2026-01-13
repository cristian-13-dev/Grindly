// lib/consents.ts
export const CONSENT_TYPE = "terms_and_privacy" as const;
export const CONSENT_VERSION = "2026-01-01" as const;

export type ConsentPayload = {
  user_id: string;
  consent_type?: typeof CONSENT_TYPE;
  version?: typeof CONSENT_VERSION;
  user_agent?: string;
};

export async function createTermsConsent(input: Omit<ConsentPayload, "consent_type" | "version">) {
  const resp = await fetch("/api/consents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: input.user_id,
      consent_type: CONSENT_TYPE,
      version: CONSENT_VERSION,
      user_agent: input.user_agent ?? (typeof navigator !== "undefined" ? navigator.userAgent : ""),
    }),
  });

  const json = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(json?.error || "Failed to save consent");

  return json;
}
