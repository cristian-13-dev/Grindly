import {FieldSeparator} from "@/components/ui/field";
import {Button} from "@/components/ui";
import {handleGithubLogin} from "@/app/login/loginIndex";
import {Github} from "lucide-react";
import GoogleGISButton from "./GoogleGISButton";


export default function SocialAuth({mode}: {mode: "login" | "signup"}) {
  return <>
    <FieldSeparator className="my-6">{mode === "login" ? "Or sign in with" : "Or sign up with"}</FieldSeparator>

    {/* Social Login Buttons */}
    <div className="space-y-3 mb-6">
      <GoogleGISButton/>

      <Button
        type="button"
        onClick={handleGithubLogin}
        variant="outline"
        className="w-full h-11 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 rounded-lg"
      >
        <Github className="w-5 h-5 mr-2"/>
        Continue with GitHub
      </Button>
    </div>
  </>
}
