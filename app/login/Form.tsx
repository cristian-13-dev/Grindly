"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialAuth from "./SocialAuth";

type Mode = "login" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="bg-white border border-neutral-300 p-8 rounded-lg">
      {mode === "login" ? (
        <LoginForm />
      ) : (
        <SignupForm />
      )}

      <SocialAuth />

      <div className="mt-6 text-center">
        <p className="text-neutral-500 text-sm">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-neutral-900 cursor-pointer font-medium hover:text-neutral-600"
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
                className="text-neutral-900 cursor-pointer font-medium hover:text-neutral-600"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
