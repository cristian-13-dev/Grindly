import {Zap} from 'lucide-react';
import LoginForm from './Form'

export default function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-lg px-6">
        {/* Logo and Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 bg-neutral-900 rounded-md">
              <Zap className="w-4 h-4 text-white fill-white"/>
            </div>
            <h1 className="text-neutral-900 font-bold text-3xl">Taskify</h1>
          </div>
          <p className="text-neutral-600">Level up your productivity</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}