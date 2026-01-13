"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForGIS(timeout = 8000) {
  const start = Date.now();
  while (!window.google?.accounts?.id) {
    if (Date.now() - start > timeout) return false;
    await sleep(50);
  }
  return true;
}

export default function GoogleGISButton() {
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const lastWidthRef = useRef<number>(0);
  const renderLockRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderButton = async (force = false) => {
      if (renderLockRef.current) return;
      renderLockRef.current = true;

      try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || !wrapperRef.current || !buttonRef.current) return;

        const gisReady = await waitForGIS();
        if (!gisReady || cancelled) return;

        const width = wrapperRef.current.offsetWidth || 360;
        const changed = Math.abs(width - lastWidthRef.current) >= 2;

        if (!force && !changed && buttonRef.current.childElementCount > 0)
          return;

        lastWidthRef.current = width;

        buttonRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: clientId,
          hl: "en",
          callback: async (response: google.accounts.id.CredentialResponse) => {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
            });

            if (!error) router.replace("/");
          },
        } as google.accounts.id.IdConfiguration & { hl: string });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "rectangular",
          logo_alignment: "left",
          width,
        });
      } finally {
        renderLockRef.current = false;
      }
    };

    renderButton(true);

    const ro = new ResizeObserver(() => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderButton(false);
      });
    });

    if (wrapperRef.current) ro.observe(wrapperRef.current);

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.google?.accounts?.id?.disableAutoSelect?.();
        renderButton(true);
      }
    });

    return () => {
      cancelled = true;
      ro.disconnect();
      data.subscription.unsubscribe();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [router]);

  return (
    <div ref={wrapperRef} className="w-full">
      <div ref={buttonRef} />
    </div>
  );
}
