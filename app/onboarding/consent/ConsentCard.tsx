"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { createTermsConsent, CONSENT_VERSION } from "@/lib/consents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ConsentCard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onContinue = async () => {
    if (!checked || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw new Error(userErr.message);
      if (!user) throw new Error("Not authenticated");

      await createTermsConsent({
        user_id: user.id,
        user_agent: navigator.userAgent,
      });

      const { error: updateErr } = await supabase.auth.updateUser({
        data: {
          tosAccepted: true,
          tosAcceptedAt: new Date().toISOString(),
          tosVersion: CONSENT_VERSION,
        },
      });

      if (updateErr) throw new Error(updateErr.message);

      router.replace("/");
      router.refresh();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>One last step</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          To use the app, you must agree to our{" "}
          <Link className="underline" href="/terms" target="_blank">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="underline" href="/privacy" target="_blank">
            Privacy Policy
          </Link>
          .
        </div>

        <label className="flex items-start gap-3">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <span className="text-sm leading-5">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>

        {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}

        <Button className="w-full" disabled={!checked || loading} onClick={onContinue}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
}
