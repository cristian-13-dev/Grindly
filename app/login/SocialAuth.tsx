import { FieldSeparator } from "@/components/ui/field";
import { GithubButton } from "@/app/login/loginIndex";
import GoogleGISButton from "./GoogleGISButton";

export default function SocialAuth({ mode }: { mode: "login" | "signup" }) {
  return (
    <>
      <FieldSeparator className="my-6">
        {mode === "login" ? "Or sign in with" : "Or sign up with"}
      </FieldSeparator>

      <div className="space-y-3 mb-6">
        <GoogleGISButton />
        <GithubButton />
      </div>
    </>
  );
}
