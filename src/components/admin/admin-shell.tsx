"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, ExternalLink, LogOut, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";

export function AdminShell({ active, children }: { active: "stats" | "blog"; children: ReactNode }) {
  const tab = (key: "stats" | "blog", href: string, label: string, Icon: typeof BarChart3) => (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm ${
        active === key ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <LogoMark className="size-7" />
            <span className="hidden font-semibold sm:inline">Admin</span>
            <nav className="flex gap-1">
              {tab("stats", "/admin", "Statistics", BarChart3)}
              {tab("blog", "/admin/blog", "Blog", PenSquare)}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                <span className="hidden sm:inline">View site</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
