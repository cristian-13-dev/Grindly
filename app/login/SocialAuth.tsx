import { GithubButton } from "@/app/login/loginIndex";
import GoogleGISButton from "./GoogleGISButton";
import { FieldSeparator } from "@/components/ui/field";

export default function SocialAuth() {
  return (
    <div className="space-y-5 mb-4 w-full *:w-full">
      <div className="space-y-3">
        <GoogleGISButton />
        <GithubButton />
      </div>
      <FieldSeparator className="my-0 *:data-[slot=field-separator-content]:bg-card">
        Or continue with
      </FieldSeparator>
    </div>
  );
}
