"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Github } from "lucide-react";

export default function GithubButton() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const update = () => {
      setWidth(wrapperRef.current?.offsetWidth || 360);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapperRef.current);

    return () => ro.disconnect();
  }, []);

  const signIn = async () => {
    if (loading) return;
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div ref={wrapperRef} className="w-full">
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        style={{ width }}
        className="relative h-10 cursor-pointer rounded border border-gray-300 bg-white px-4 text-[14px] text-gray-900 hover:bg-gray-50 disabled:opacity-60"
      >
        <Github className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-700" />

        <span className="block text-center ml-6 leading-9.5">
          {loading ? "Redirecting..." : "Sign in with GitHub"}
        </span>
      </button>
    </div>
  );
}
