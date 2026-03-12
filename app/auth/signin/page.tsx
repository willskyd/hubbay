"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProviderMap = Record<
  string,
  {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
  }
>;

function SignInContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [providers, setProviders] = useState<ProviderMap>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      const response = await fetch("/api/auth/providers");
      if (!response.ok) return;
      const data = (await response.json()) as ProviderMap;
      setProviders(data);
    };
    loadProviders();
  }, []);

  const submit = async () => {
    if (!email || !password) {
      setMessage("Enter email and password.");
      return;
    }

    setLoading(true);
    setMessage("");
    const result = await signIn("customer-login", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });
    setLoading(false);

    if (!result || result.error) {
      setMessage("Invalid customer credentials.");
      return;
    }

    window.location.href = result.url || callbackUrl;
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Customer Access</p>
        <h1 className="mt-2 text-3xl font-black text-hubbay-text">Sign In to HubBay</h1>
        <p className="mt-2 text-sm text-hubbay-secondary">
          Use your customer account to place orders and track deliveries.
        </p>

        <div className="mt-5 space-y-2">
          {Object.values(providers)
            .filter((provider) => provider.type !== "credentials")
            .map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full"
                onClick={() => signIn(provider.id, { callbackUrl })}
              >
                Continue with {provider.name}
              </Button>
            ))}
        </div>

        <div className="mt-6 space-y-3 rounded-2xl border border-hubbay-gold/20 p-4">
          <h2 className="text-sm font-semibold text-hubbay-text">Customer Login</h2>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="w-full" disabled={loading} onClick={submit}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          {message ? <p className="text-xs text-hubbay-secondary">{message}</p> : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-hubbay-secondary">
          <Link className="underline-offset-2 hover:underline" href="/auth/signup">
            Create customer account
          </Link>
          <Link className="underline-offset-2 hover:underline" href="/auth/admin">
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
          <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
            <p className="text-sm text-hubbay-secondary">Loading sign-in...</p>
          </div>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
