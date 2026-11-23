import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { isLocale, localePath } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = ["Drama lists", "Drama guides", "Watching tips"];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function refresh(lang: string, slug: string) {
  // Blog list, the article itself, the home page teaser and the sitemap.
  revalidatePath(`/${lang}/blog`);
  revalidatePath(`/${lang}/blog/${slug}`);
  revalidatePath(`/${lang}`);
  revalidatePath("/sitemap.xml");
}

/** GET - all admin-written articles (newest first). */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

/** POST - create an article. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const str = (k: string, max: number) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");

  const title = str("title", 200);
  const content = str("content", 60000);
  const description = str("description", 300);
  const lang = str("lang", 5) || "en";
  if (!title || !content || !description) {
    return NextResponse.json({ error: "Title, meta description and content are required." }, { status: 400 });
  }
  if (!isLocale(lang)) return NextResponse.json({ error: "Unknown language." }, { status: 400 });
  const slug = slugify(str("slug", 100) || title);
  if (!slug) return NextResponse.json({ error: "Could not make a URL slug - add one." }, { status: 400 });
  if (await db.blogPost.findUnique({ where: { slug_lang: { slug, lang } } })) {
    return NextResponse.json({ error: `An article with the slug "${slug}" already exists in this language.` }, { status: 409 });
  }
  const category = CATEGORIES.includes(str("category", 40)) ? str("category", 40) : "Drama guides";

  const post = await db.blogPost.create({
    data: {
      slug,
      lang,
      title,
      metaTitle: str("metaTitle", 70) || title.slice(0, 60),
      description,
      excerpt: str("excerpt", 400) || description,
      keywords: str("keywords", 500),
      category,
      coverKicker: (str("coverKicker", 20) || "NEW").toUpperCase(),
      content,
      published: b.published !== false,
    },
  });
  refresh(lang, slug);
  return NextResponse.json({ post, url: localePath(lang, `/blog/${slug}`) }, { status: 201 });
}

/** PATCH { id, published } - publish or unpublish. */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id, published } = (await req.json().catch(() => ({}))) as { id?: string; published?: boolean };
  if (!id || typeof published !== "boolean") return NextResponse.json({ error: "id and published are required." }, { status: 400 });
  const post = await db.blogPost.update({ where: { id }, data: { published } }).catch(() => null);
  if (!post) return NextResponse.json({ error: "Article not found." }, { status: 404 });
  refresh(post.lang, post.slug);
  return NextResponse.json({ post });
}

/** DELETE ?id= - remove an article. */
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const post = await db.blogPost.delete({ where: { id } }).catch(() => null);
  if (!post) return NextResponse.json({ error: "Article not found." }, { status: 404 });
  refresh(post.lang, post.slug);
  return NextResponse.json({ ok: true });
}
