"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
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

import { forgotPasswordSchema } from "@/validations/forgot-password";

export default function ForgotPasswordPreview() {
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    const loadingId = toast.loading("Sending reset link...");

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;

      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${appUrl}/api/auth/callback?next=/reset-password`,
        }
      );
      toast.dismiss(loadingId);

      if (error) {
        console.error("[Supabase] resetPasswordForEmail error:", error);
      }

      setSent(true);
      toast.success(
        "If an account exists for this email, you’ll receive a reset link shortly."
      );
    } catch (e) {
      toast.dismiss(loadingId);
      console.error("Error sending password reset email", e);
      toast.error("Failed to send password reset email. Please try again.");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl">Forgot Password</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {sent
              ? "Check your email for a reset link."
              : "Enter your email address to receive the password reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <Button className="w-full" onClick={() => setSent(false)}>
              Send another link
            </Button>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          className="h-10 sm:h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Sending..."
                    : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
