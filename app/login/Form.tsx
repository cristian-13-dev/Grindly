"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialAuth from "./SocialAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import ConsentLink from "./ConsentLink";

type Mode = "login" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");

  const title = mode === "login" ? "Welcome back" : "Create an account";
  const subtitle =
    mode === "login"
      ? "Login with your Google or GitHub account"
      : "Sign up with your Google or GitHub account";

  return (
    <div className="w-full flex flex-col gap-3 mx-auto max-w-sm">
      <Card>
        <CardHeader className="text-center gap-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <SocialAuth />

            <div className="space-y-6">
              {mode === "login" ? <LoginForm /> : <SignupForm />}
            </div>

            <FieldDescription className="text-center">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-neutral-800 hover:text-neutral-700 hover:underline font-semibold cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-neutral-800 hover:text-neutral-700 hover:underline font-semibold cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </FieldDescription>
          </div>
        </CardContent>
      </Card>

      <ConsentLink mode={mode} />
    </div>
  );
}
