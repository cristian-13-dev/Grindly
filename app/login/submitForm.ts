import React from "react";
import type {LoginValues, RegisterValues} from "@/validations/auth";
import {useRouter} from "next/navigation";
import {ENDPOINTS} from "@/lib/api"

export const useOnSubmit = (
  setStatus: React.Dispatch<React.SetStateAction<{ isSubmitting: boolean; errorMsg: string }>>,
  mode: 'login' | 'signup'
) => {
  const router = useRouter();
  return async (values: LoginValues | RegisterValues) => {
    try {
      setStatus((prev) => ({...prev, isSubmitting: true, errorMsg: ""}))

      const endpoint = mode === 'login' ? ENDPOINTS.AUTH.SIGN_IN : ENDPOINTS.AUTH.SIGN_UP;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values),
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setStatus(prev => ({...prev, errorMsg: err instanceof Error ? err.message : String(err)}))
    } finally {
      setStatus((prev) => ({...prev, isSubmitting: false}))
    }
  };
};