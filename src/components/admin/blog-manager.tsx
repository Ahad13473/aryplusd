"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, CircleAlert, ExternalLink, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localeInfo, localePath, locales, type Locale } from "@/i18n/config";

interface AdminPost {
  id: string;
  slug: string;
  lang: string;
  title: string;
  description: string;
  keywords: string;
  category: string;
  published: boolean;
  createdAt: string;
}

const EMPTY = {
  lang: "en" as Locale,
  title: "",
  slug: "",
  metaTitle: "",
  description: "",
  excerpt: "",
  keywords: "",
  category: "Drama guides",
  coverKicker: "NEW",
  content: "",
  published: true,
};

const CONTENT_HELP = `## A heading

A paragraph. Leave an empty line between paragraphs. **Bold** and [links](/how-to-use) work.

- A list item
- Another list item`;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between gap-2 text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Count({ n, min, max }: { n: number; min: number; max: number }) {
  const ok = n >= min && n <= max;
  return <span className={ok ? "text-emerald-500" : "text-amber-500"}>{n} / {min}-{max}</span>;
}

export function BlogManager() {
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminPost | null>(null);

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/posts", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return { posts: [] as AdminPost[] };
      }
      return (await res.json()) as { posts: AdminPost[] };
    },
  });
  const posts = data?.posts ?? [];
  const load = () => void queryClient.invalidateQueries({ queryKey: ["admin-posts"] });

  const metaTitle = form.metaTitle || form.title;
  const words = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const mainKeyword = form.keywords.split(",")[0]?.trim().toLowerCase() ?? "";

  // Quick on-page SEO checklist.
  const checks = useMemo(
    () => [
      { ok: metaTitle.length >= 30 && metaTitle.length <= 60, text: "Meta title is 30-60 characters" },
      { ok: form.description.length >= 120 && form.description.length <= 160, text: "Meta description is 120-160 characters" },
      { ok: !!mainKeyword && metaTitle.toLowerCase().includes(mainKeyword), text: "Main keyword (first in the list) appears in the title" },
      { ok: !!mainKeyword && form.description.toLowerCase().includes(mainKeyword), text: "Main keyword appears in the description" },
      { ok: words >= 300, text: `At least 300 words (now ${words})` },
      { ok: /^## /m.test(form.content), text: "Uses ## headings to structure the article" },
    ],
    [metaTitle, form.description, form.content, mainKeyword, words],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string };
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error || "Could not publish the article.");
      return;
    }
    toast.success(form.published ? "Article published" : "Draft saved", { description: data.url });
    setForm(EMPTY);
    setSlugTouched(false);
    load();
  };

  const togglePublish = async (p: AdminPost) => {
    const res = await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, published: !p.published }),
    });
    if (res.ok) {
      toast.success(p.published ? "Unpublished" : "Published");
      load();
    } else toast.error("Could not update the article.");
  };

  const remove = async (p: AdminPost) => {
    const res = await fetch(`/api/admin/posts?id=${encodeURIComponent(p.id)}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Article deleted");
      load();
    } else toast.error("Could not delete the article.");
  };

  const rtl = localeInfo[form.lang].dir === "rtl";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-border/60 bg-card/60 p-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Write an article</h1>
          <p className="text-sm text-muted-foreground">Published articles appear on the blog, the home page, the sitemap and the RSS feed within a minute.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Language">
            <select
              value={form.lang}
              onChange={(e) => set("lang", e.target.value as Locale)}
              className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {locales.map((l) => (
                <option key={l} value={l} className="bg-background">
                  {localeInfo[l].name} - {localeInfo[l].native}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm">
              {["Drama guides", "Drama lists", "Watching tips"].map((c) => (
                <option key={c} className="bg-background">
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cover label" hint="e.g. NEW, TOP 10">
            <Input value={form.coverKicker} maxLength={16} onChange={(e) => set("coverKicker", e.target.value.toUpperCase())} />
          </Field>
        </div>

        <Field label="Title (H1)">
          <Input
            value={form.title}
            dir={rtl ? "rtl" : "ltr"}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL slug" hint={<span dir="ltr">{localePath(form.lang, `/blog/${form.slug || "..."}`)}</span>}>
            <Input
              value={form.slug}
              dir="ltr"
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="Meta title (Google)" hint={<Count n={metaTitle.length} min={30} max={60} />}>
            <Input value={form.metaTitle} dir={rtl ? "rtl" : "ltr"} placeholder={form.title} onChange={(e) => set("metaTitle", e.target.value)} />
          </Field>
        </div>

        <Field label="Meta description (Google snippet)" hint={<Count n={form.description.length} min={120} max={160} />}>
          <Textarea value={form.description} dir={rtl ? "rtl" : "ltr"} rows={2} onChange={(e) => set("description", e.target.value)} required />
        </Field>

        <Field label="Keywords" hint="comma separated - the first one is the main keyword">
          <Input value={form.keywords} dir={rtl ? "rtl" : "ltr"} placeholder="latest ARY dramas 2026, ARY drama download" onChange={(e) => set("keywords", e.target.value)} />
        </Field>

        <Field label="Short summary" hint="shown on cards and under the title">
          <Textarea value={form.excerpt} dir={rtl ? "rtl" : "ltr"} rows={2} onChange={(e) => set("excerpt", e.target.value)} />
        </Field>

        <Field label="Article" hint={`${words} words`}>
          <Textarea
            value={form.content}
            dir={rtl ? "rtl" : "ltr"}
            rows={16}
            placeholder={CONTENT_HELP}
            className="font-mono text-sm"
            onChange={(e) => set("content", e.target.value)}
            required
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-emerald-600" />
            Publish now (untick to save as a draft)
          </label>
          <Button type="submit" disabled={saving} className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {form.published ? "Publish article" : "Save draft"}
          </Button>
        </div>
      </form>

      <aside className="space-y-4">
        <section className="rounded-xl border border-border/60 bg-card/60 p-4">
          <h2 className="mb-3 text-sm font-semibold">SEO checklist</h2>
          <ul className="space-y-2 text-sm">
            {checks.map((c) => (
              <li key={c.text} className="flex gap-2">
                {c.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" /> : <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />}
                <span className={c.ok ? "" : "text-muted-foreground"}>{c.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border/60 bg-card/60 p-4">
          <h2 className="mb-3 text-sm font-semibold">Your articles ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No articles yet. The built-in articles are always shown on the blog.</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {posts.map((p) => (
                <li key={p.id} className="space-y-2 py-3">
                  <p className="text-sm font-medium leading-snug" dir="auto">
                    {p.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {localeInfo[p.lang as Locale]?.name ?? p.lang}
                    </Badge>
                    <Badge variant={p.published ? "default" : "outline"} className={`text-[10px] ${p.published ? "bg-emerald-600 text-white" : ""}`}>
                      {p.published ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{p.createdAt.slice(0, 10)}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button asChild size="sm" variant="ghost" className="h-8 gap-1 px-2 text-xs">
                      <a href={localePath(p.lang as Locale, `/blog/${p.slug}`)} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3.5" /> View
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 gap-1 px-2 text-xs" onClick={() => void togglePublish(p)}>
                      {p.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      {p.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 gap-1 px-2 text-xs text-destructive hover:text-destructive" onClick={() => setPendingDelete(p)}>
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{pendingDelete?.title}&quot; will be removed from the site permanently. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) void remove(pendingDelete);
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
