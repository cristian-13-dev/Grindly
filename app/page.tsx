"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function App() {
  const router = useRouter();

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <h1>Welcome to the main page</h1>
      <Button onClick={handleLogOut}>Log Out</Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Event has been created")}
      >
        Success
      </Button>
    </>
  );
}
