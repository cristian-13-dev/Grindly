import { FieldDescription } from "@/components/ui/field";

export default function ConsentLink({ mode }: { mode: "login" | "signup" }) {
  return (
    <FieldDescription className="px-6 mt-6 text-center">
      By clicking {mode === "login" ? "Login" : "Sign up"}, you agree to our{" "}
      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </FieldDescription>
  );
}
