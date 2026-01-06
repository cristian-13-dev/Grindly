import React from "react";
import type { LoginValues, RegisterValues } from "@/validations/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export const useOnSubmit = (
  setStatus: React.Dispatch<
    React.SetStateAction<{ isSubmitting: boolean; errorMsg: string }>
  >,
  mode: "login" | "signup"
) => {
  const router = useRouter();

  return async (values: LoginValues | RegisterValues) => {
    try {
      setStatus({ isSubmitting: true, errorMsg: "" });

      const { data, error } =
        mode === "login"
          ? await supabase.auth.signInWithPassword({
              email: values.email,
              password: values.password,
            })
          : await supabase.auth.signUp({
              email: values.email,
              password: values.password,
              options: {
                data: {
                  username: (values as RegisterValues).username,
                },
              },
            });

      if (error) {
        throw new Error(error.message);
      }

      const session = data?.session;
      if (!session && mode === "signup") {
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
      return;
    } finally {
      setStatus((prev) => ({ ...prev, isSubmitting: false }));
    }
  };
};
