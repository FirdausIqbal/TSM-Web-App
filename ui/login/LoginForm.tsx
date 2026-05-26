"use client";
import { Loader2, Lock, UserCheck2 } from "lucide-react";
import { useActionState } from "react";
import { loginAction } from "../../actions/authentication";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [state, formAction, pending] = useActionState(loginAction, null);
  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Masuk Ke Akun</h2>

      {/* State error login */}
      {state?.error && (
        <p className="text-sm text-destructive mb-2">{state.error}</p>
      )}
      
      {/* Form Login */}
      <form action={formAction} className="space-y-5">
        {/* username input */}
        <div>
          <label htmlFor="username" className="text-sm font-medium block mb-2">
            Username
          </label>
          <div className="relative">
            <UserCheck2
              className="absolute left-3 top-3.5 text-muted-foreground"
              size={18}
            />
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              placeholder="your username ..."
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* password input */}
        <div>
           <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-muted-foreground"
              size={18}
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="off"
              placeholder="••••••••"
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* submit button */}
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>
    </div>
  );
}
