import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const userId = body?.user_id as string | undefined;
  const consentType = body?.consent_type ?? "terms_and_privacy";
  const version = body?.version ?? "2026-01-01";

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const userAgent =
    body?.user_agent ?? req.headers.get("user-agent") ?? null;

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]?.trim()
      : null;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("user_consents").insert({
    user_id: userId,
    consent_type: consentType,
    version,
    accepted_at: new Date().toISOString(),
    ip_address: ip,
    user_agent: userAgent,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
