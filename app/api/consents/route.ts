import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const userId = body?.user_id as string | undefined;
  const termsVersion = (body?.terms_version as string | undefined) ?? "2026-01-01";
  const privacyVersion =
    (body?.privacy_version as string | undefined) ?? "2026-01-01";

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("user_consents").insert([
    {
      user_id: userId,
      consent_type: "terms",
      version: termsVersion,
      accepted_at: new Date().toISOString(),
    },
    {
      user_id: userId,
      consent_type: "privacy",
      version: privacyVersion,
      accepted_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
