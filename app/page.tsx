'use client'
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';
import {Spinner} from '@/components/ui/spinner'
import {Github, TriangleAlert, Zap} from 'lucide-react';
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {loginSchema, type LoginValues} from "@/validations/auth"

export default function App() {
  const [status, setStatus] = useState({
    isSubmitting: false,
    errorMsg: ""
  })

  const {isSubmitting, errorMsg} = status

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      setStatus((prev) => ({...prev, isSubmitting: true, errorMsg: ""}))

      const response = await fetch('https://grindly-5.onrender.com/api/v1/auth/sign-in', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setStatus(prev => ({...prev, errorMsg: err instanceof Error ? err.message : String(err)}))
    } finally {
      setStatus((prev) => ({...prev, isSubmitting: false}))
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Handle Google OAuth
  };

  const handleGithubLogin = () => {
    console.log('Github login clicked');
    // Handle Github OAuth
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md px-6">
        {/* Logo and Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-900 rounded-lg">
              <Zap className="w-5 h-5 text-white fill-white"/>
            </div>
            <h1 className="text-neutral-900 font-bold text-3xl">Taskify</h1>
          </div>
          <p className="text-neutral-600">Level up your productivity</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-neutral-300 p-8 rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-neutral-900">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                        className="h-11 px-4 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-0 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-neutral-900">Password</FormLabel>
                      <button
                        type="button"
                        className="text-neutral-500 hover:text-neutral-700 duration-250 cursor-pointer text-xs"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        className="h-11 px-4 bg-white border border-neutral-300 focus:border-neutral-900 focus:ring-0 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 rounded border-neutral-300 cursor-pointer data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer text-neutral-900">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-3">
                {errorMsg && (
                  <p className="text-red-500 flex items-center mx-auto gap-1 text-xs">
                    <TriangleAlert className="w-4 h-4"/> {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-neutral-900 disabled:opacity-80 hover:bg-neutral-800 text-white rounded-lg"
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? <><Spinner/> <span>Signing in...</span></> : <span>Sign In</span>}
                </Button>
              </div>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-11 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-500 text-sm">
              Don&apos;t have an account?{' '}
              <span className="text-neutral-900 text-sm cursor-pointer hover:text-neutral-700">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}