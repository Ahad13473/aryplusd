import { localeInfo, localePath, locales } from "@/i18n/config";
import en from "@/i18n/dictionaries/en";
import { listPosts } from "@/lib/blog-store";
import { site } from "@/lib/site";
import { tutorialVideos } from "@/lib/video";

export const revalidate = 3600;

/** llms.txt: a plain summary AI assistants read to understand and cite the site. */
export async function GET() {
  const posts = await listPosts("en");
  const body = `# ${site.name} - ${en.meta.tagline}

> ${en.meta.description}

${site.name} (${site.domain}) is a free web tool that saves ARY Plus and ARY ZAP drama episodes as MP4 files on the user's own device. It runs in any browser on Android, iPhone, Windows, Mac and Linux, needs no app or account, and offers every published quality from 240p to 4K with the exact file size shown before download. Several episodes can download at the same time. Files are deleted from the server once delivered. Premium/DRM titles are not supported. It is independent and not affiliated with ARY Digital Network.

The site is available in ${locales.length} languages: ${locales.map((l) => `${localeInfo[l].name} (${site.url}${localePath(l, "/")})`).join(", ")}.

## How to download an ARY Plus episode
${en.steps.map((s, i) => `${i + 1}. **${s.title}** - ${s.text}`).join("\n")}

## Video tutorial (English and Urdu narration)
${Object.values(tutorialVideos).map((v) => `- [${v.title}](${site.url}${v.src}) - ${v.description}`).join("\n")}

## Typical file size of a 40-minute episode
- 240p: ~55 MB
- 480p: ~120 MB
- 720p: ~220 MB
- 1080p: ~440 MB
- 2160p (4K): ~1.4 GB

## FAQ
${en.faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Guides
${en.guides.map((g) => `- [${g.h1}](${site.url}/${g.slug}): ${g.description}`).join("\n")}

## Blog
${posts.map((p) => `- [${p.title}](${site.url}${localePath(p.lang, `/blog/${p.slug}`)}): ${p.description}`).join("\n")}

## Pages
- [Downloader](${site.url}/): paste a link and download
- [How to use](${site.url}/how-to-use)
- [FAQ](${site.url}/faq)
- [About](${site.url}/about)
- [Contact](${site.url}/contact)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
