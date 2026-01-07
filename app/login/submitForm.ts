import React from "react";
import type { LoginValues, RegisterValues } from "@/validations/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Status = { isSubmitting: boolean; errorMsg: string };

export const useOnSubmit = (
  setStatus: React.Dispatch<React.SetStateAction<Status>>,
  mode: "login" | "signup"
) => {
  const router = useRouter();

  return async (values: LoginValues | RegisterValues) => {
    try {
      setStatus({ isSubmitting: true, errorMsg: "" });

      // MARK: LOGIN
      if (mode === "login") {
        const rememberMe = (values as LoginValues).rememberMe;

        document.cookie = `remember_me=${rememberMe ? "1" : "0"}; Path=/; SameSite=Lax`;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw new Error(error.message);
        if (!data?.session) throw new Error("No session returned");

        router.replace("/");
        router.refresh();
        return;
      }

      // MARK: SIGN UP
      const v = values as RegisterValues;

      if (!v.terms) {
        throw new Error("You must accept the Terms and Privacy Policy.");
      }

      const CONSENT_VERSION = "2026-01-01";

      const { data, error } = await supabase.auth.signUp({
        email: v.email,
        password: v.password,
        options: {
          data: {
            username: v.username,
          },
        },
      });

      if (error) throw new Error(error.message);

      const userId = data.user?.id;
      if (!userId) throw new Error("User not returned from Supabase");

      const resp = await fetch("/api/consents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          consent_type: "terms_and_privacy",
          version: CONSENT_VERSION,
          user_agent: navigator.userAgent,
        }),
      });

      const json = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error(json?.error || "Failed to save consent");

      if (!data.session) {
        router.replace("/login");
        router.refresh();
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setStatus({
        isSubmitting: false,
        errorMsg: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setStatus((prev) => ({ ...prev, isSubmitting: false }));
    }
  };
};
