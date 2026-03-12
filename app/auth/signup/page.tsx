"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SignupContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!name || !email || !password) {
      setMessage("Please complete all required fields.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setMessage(data.error || "Unable to create account.");
        return;
      }

      const login = await signIn("customer-login", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!login || login.error) {
        setMessage("Account created. Please sign in manually.");
        return;
      }

      window.location.href = login.url || callbackUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Create Account</p>
        <h1 className="mt-2 text-3xl font-black text-hubbay-text">Customer Signup</h1>
        <p className="mt-2 text-sm text-hubbay-secondary">
          Create a real HubBay customer account.
        </p>

        <div className="mt-6 space-y-3 rounded-2xl border border-hubbay-gold/20 p-4">
          <Input
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button className="w-full" disabled={loading} onClick={signup}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          {message ? <p className="text-xs text-hubbay-secondary">{message}</p> : null}
        </div>

        <div className="mt-4 text-xs text-hubbay-secondary">
          Already have an account?{" "}
          <Link className="underline-offset-2 hover:underline" href="/auth/signin">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
          <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
            <p className="text-sm text-hubbay-secondary">Loading signup...</p>
          </div>
        </main>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
