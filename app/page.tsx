"use client";
import { Button } from "@/components/ui";
import { ENDPOINTS } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();

  async function handleLogOut() {
    const response = await fetch(ENDPOINTS.AUTH.SIGN_OUT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Something went wrong");
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <h1>Welcome to the main page</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
    </>
  );
}
