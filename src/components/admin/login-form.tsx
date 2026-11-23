"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/site/logo";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
      return;
    }
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setError(data.error || "Sign-in failed.");
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <LogoMark />
        <div>
          <h1 className="text-lg font-semibold">ARYPlusD Admin</h1>
          <p className="text-xs text-muted-foreground">Statistics and blog</p>
        </div>
      </div>
      {!enabled ? (
        <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-500">
          Admin is turned off. Add <code>ADMIN_PASSWORD=&quot;at-least-8-characters&quot;</code> to <code>.env</code> and restart the server.
        </p>
      ) : (
        <>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              autoFocus
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy || !password} className="h-11 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-500">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            Sign in
          </Button>
        </>
      )}
    </form>
  );
}
