"use client";

import Script from "next/script";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";


export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = () => window.dispatchEvent(new Event("gis-loaded"));
    window.addEventListener("gis-native-load", handler);
    return () => window.removeEventListener("gis-native-load", handler);
  }, []);

  return (
    <>
      {children}
      <Toaster />

      <Script
        src="https://accounts.google.com/gsi/client?hl=en"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event("gis-loaded"));
        }}
      />
    </>
  );
}
