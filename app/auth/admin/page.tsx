"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@hubbay.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const login = async () => {
    if (!email || !password) {
      setMessage("Enter admin email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await signIn("admin-login", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setMessage("Invalid admin credentials.");
      return;
    }

    window.location.href = result.url || "/dashboard";
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Admin Access</p>
        <h1 className="mt-2 text-3xl font-black text-hubbay-text">HubBay Admin Login</h1>
        <p className="mt-2 text-sm text-hubbay-secondary">
          Authorized administrators only.
        </p>

        <div className="mt-6 space-y-3 rounded-2xl border border-hubbay-gold/20 p-4">
          <Input
            type="email"
            placeholder="admin@hubbay.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="w-full" disabled={loading} onClick={login}>
            {loading ? "Signing in..." : "Sign in as Admin"}
          </Button>
          {message ? <p className="text-xs text-hubbay-secondary">{message}</p> : null}
        </div>

        <div className="mt-4 text-xs text-hubbay-secondary">
          Customer account?{" "}
          <Link className="underline-offset-2 hover:underline" href="/auth/signin">
            Go to customer sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
