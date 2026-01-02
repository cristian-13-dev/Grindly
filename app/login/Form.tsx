"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Checkbox, Form, Input, Spinner } from "@/components/ui";
import { TriangleAlert } from "lucide-react";
import { useOnSubmit } from "./submitForm";
import SocialAuth from "./SocialAuth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  LoginValues,
  registerSchema,
  RegisterValues,
} from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [status, setStatus] = useState({
    isSubmitting: false,
    errorMsg: "",
  });

  const { isSubmitting, errorMsg } = status;

  const onSubmitHandler = useOnSubmit(setStatus, mode);

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
      rememberMe: false,
      terms: false,
    },
  });

  // Reset form when mode changes
  useEffect(() => {
    form.reset({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
      rememberMe: false,
      terms: false,
    });
  }, [mode, form]);

  return (
    <div className="bg-white border border-neutral-300 p-8 rounded-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-5"
        >
          {mode === "signup" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
                      type="text"
                      {...field}
                      className="h-11 px-4 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-0 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-900">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                    className="h-11 px-4 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-0 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-neutral-900">Password</FormLabel>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-neutral-500 hover:text-neutral-700 duration-250 cursor-pointer text-xs"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    {...field}
                    className="h-11 px-4 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-0 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === "signup" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      {...field}
                      className="h-11 px-4 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-0 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {mode === "login" ? (
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 rounded border-neutral-300 cursor-pointer data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer text-neutral-900">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="">
                  <div className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 rounded border-neutral-300 cursor-pointer data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer text-neutral-900">
                      I agree to the Terms of Service and Privacy Policy
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col space-y-3">
            {errorMsg && (
              <p className="text-red-500 flex items-center mx-auto gap-1 text-xs">
                <TriangleAlert className="w-4 h-4" /> {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-neutral-900 disabled:opacity-80 hover:bg-neutral-800 text-white rounded-lg"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <>
                  <Spinner />{" "}
                  <span>
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                </>
              ) : (
                <span>{mode === "login" ? "Sign In" : "Sign Up"}</span>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <SocialAuth />

      {/* Mode Toggle Link */}
      <div className="mt-6 text-center">
        <p className="text-neutral-500 text-sm">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                onClick={() => setMode("signup")}
                className="text-neutral-900 text-sm cursor-pointer hover:text-neutral-700 font-medium"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setMode("login")}
                className="text-neutral-900 text-sm cursor-pointer hover:text-neutral-700 font-medium"
              >
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
