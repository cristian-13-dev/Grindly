import { Zap } from "lucide-react";
import AuthForm from "./Form";

export default function App() {
  return (
    <main className="min-h-svh bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 mt-0.5 bg-neutral-900 rounded-sm">
              <Zap className="w-3 h-3 text-white fill-white" />
            </span>
            <h1 className="text-neutral-900 font-bold text-2xl">Unknown</h1>
          </div>
        </header>

        <AuthForm />
      </div>
    </main>
  );
}
