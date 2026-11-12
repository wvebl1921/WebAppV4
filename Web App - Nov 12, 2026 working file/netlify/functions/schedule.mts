// Reads the schedule table from the league's Google Site so the mobile app always
// matches it. Browsers can't fetch that page directly (cross-origin), hence this proxy.
const SOURCE_URL = "https://www.wvebl.com/schedule";

const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " } as Record<string, string>)[e.toLowerCase()] ?? m;
  });

const text = (html: string) => decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();

export default async () => {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) return Response.json({ error: "Schedule source unavailable" }, { status: 502 });
  const page = await res.text();

  // The schedule lives in a custom HTML embed, stored HTML-escaped in a data-code attribute.
  const embeds = [...page.matchAll(/data-code="([^"]*)"/g)].map((m) => decode(m[1]));
  const embed = embeds.find((e) => /<th[^>]*>\s*Home\s*<\/th>/i.test(e));
  if (!embed) return Response.json({ error: "Schedule not found" }, { status: 502 });

  const titleMatch = embed.match(/<h\d[^>]*>([\s\S]*?)<\/h\d>/i);
  const games = [...embed.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => text(c[1])))
    .filter((c) => c.length >= 6 && c[0])
    .map(([week, date, day, home, visitor, venue]) => ({ week, date, day, home, visitor, venue }));

  const pdf = page.match(/https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view[^"'\s\\]*/)?.[0];

  return Response.json(
    { title: titleMatch ? text(titleMatch[1]) : "", games, pdf: pdf ? decode(pdf) : null, source: SOURCE_URL },
    { headers: { "Netlify-CDN-Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400", "Cache-Control": "public, max-age=300" } }
  );
};

export const config = { path: "/api/schedule" };
