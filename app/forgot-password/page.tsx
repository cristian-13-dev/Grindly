"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
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

import { forgotPasswordSchema } from "@/validations/forgot-password";

export default function ForgetPasswordPreview() {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      });

      router.replace("/reset-password");
      router.refresh();

      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email", error);
      toast.error("Failed to send password reset email. Please try again.");
    }
  }

  return (
    <div className="flex min-h-[40vh] w-full h-screen items-center justify-center px-4 py-8 sm:min-h-[60vh] sm:px-6 lg:min-h-[70vh] lg:px-8">
      <Card className="w-full max-w-md sm:max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl sm:text-2xl">Forgot Password</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your email address to receive the password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <div className="grid gap-4 sm:gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel
                        htmlFor="email"
                        className="text-sm sm:text-base"
                      >
                        Email
                      </FormLabel>
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

                <Button type="submit" className="w-full h-10 sm:h-11">
                  Send Reset Link
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
