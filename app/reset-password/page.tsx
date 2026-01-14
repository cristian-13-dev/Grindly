"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { resetPasswordSchema } from "@/validations/reset-password";

const formSchema = resetPasswordSchema;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error) {
        console.error("[Supabase] getSession error:", error);
        toast.error("Something went wrong. Please try again.");
        router.replace("/forgot-password");
        return;
      }

      if (!data.session) {
        toast.error(
          "This reset link is invalid or has expired. Please request a new one."
        );
        router.replace("/forgot-password");
        return;
      }

      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingId = toast.loading("Updating your password...");

    try {
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();

      if (sessionErr) throw new Error(sessionErr.message);

      if (!sessionData.session) {
        toast.dismiss(loadingId);
        toast.error(
          "This reset link is invalid or has expired. Please request a new one."
        );
        router.replace("/forgot-password");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw new Error(error.message);

      await supabase.auth.signOut();

      toast.dismiss(loadingId);
      toast.success(
        "Password updated. You can now sign in with your new password."
      );

      // Navigate after a short delay so the user sees the success toast
      setTimeout(() => {
        window.location.assign("/login");
      }, 700);
    } catch (e) {
      toast.dismiss(loadingId);
      console.error("Error resetting password", e);

      toast.error(
        e instanceof Error
          ? e.message
          : "Failed to update password. Please try again."
      );
    }
  }

  return (
    <div className="flex min-h-[40vh] w-full h-screen items-center justify-center px-4 py-8 sm:min-h-[60vh] sm:px-6 lg:min-h-[70vh] lg:px-8">
      <Card className="w-full max-w-md sm:max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">New password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                          disabled={!ready}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm new password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                          disabled={!ready}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!ready || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Updating..."
                    : "Update password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
