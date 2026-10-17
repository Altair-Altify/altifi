/* ---------- RealImage: real photos from Wikimedia Commons, fetched by the USER'S browser (design doc 10c.8) ----------
 * Data declares { query, file? }:
 *   query — search words, e.g. "1931 soup kitchen line Chicago"
 *   file  — a specific Commons file name once the team has picked one ("Foo.jpg"); pins the photo for the demo video.
 * Only freely licensed files are accepted (Public domain, CC0, CC BY, CC BY-SA) — read from extmetadata.LicenseShortName.
 * Results are cached in localStorage; offline / error / nothing found → an SVG illustration (the fallback passed in).
 * Picking photos: open the app with ?pick=1 (or run the dev server) → each photo gets "next photo" and
 * "copy imageFile" buttons; paste the copied line into the lesson/article data. */
import { esc } from "../core/util";
import { lang } from "../i18n/i18n";
import { reg } from "../core/actions";
import { icon } from "./icons";

export interface PhotoSpec { query?: string; file?: string; alt?: string }
interface Found { url: string; title: string; artist: string; license: string; page: string; w: number; h: number }
interface Cached { ok: boolean; list: Found[]; at: number }

const API = "https://commons.wikimedia.org/w/api.php";
const CK = "altifi-img-v1:";
const RETRY_MS = 6 * 3600e3; // retry failed lookups after 6 hours
const mem: Record<string, Promise<Cached>> = {};
const pickIdx: Record<string, number> = {};
export const pickMode = () => import.meta.env.DEV || /[?&]pick=1/.test(location.search);

const FREE = (short: string) => {
  const l = short.toLowerCase().trim();
  return l.includes("public domain") || /^pd\b|^pd-/.test(l) || l.includes("cc0") || /^cc[- ]by(-sa)?(\b|[- ]\d)/.test(l);
};
const strip = (h: string) => { const d = document.createElement("div"); d.innerHTML = h; return (d.textContent || "").replace(/\s+/g, " ").trim(); };

function parse(json: any): Found[] {
  const pages: any[] = Object.values(json?.query?.pages || {});
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const out: Found[] = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0], md = ii?.extmetadata || {};
    if (!ii || !/^image\/(jpeg|png|webp)/.test(ii.mime || "image/jpeg")) continue;
    const short = md.LicenseShortName?.value || "";
    if (!FREE(short) || md.NonFree?.value === "true") continue;
    out.push({
      url: ii.thumburl || ii.url, title: String(p.title || "").replace(/^File:/, ""),
      artist: strip(md.Artist?.value || "") || (lang() === "vi" ? "Không rõ tác giả" : "Unknown author"),
      license: short, page: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
      w: ii.thumbwidth || ii.width || 800, h: ii.thumbheight || ii.height || 500,
    });
  }
  return out;
}

function lookup(spec: PhotoSpec): Promise<Cached> {
  const key = spec.file ? "f:" + spec.file : "q:" + (spec.query || "");
  if (key in mem) return mem[key];
  try {
    const c: Cached | null = JSON.parse(localStorage.getItem(CK + key) || "null");
    if (c && (c.ok || Date.now() - c.at < RETRY_MS)) return (mem[key] = Promise.resolve(c));
  } catch { /* storage blocked */ }
  const params = new URLSearchParams({ action: "query", format: "json", origin: "*", prop: "imageinfo", iiprop: "url|extmetadata|mime|size", iiurlwidth: "800" });
  if (spec.file) params.set("titles", "File:" + spec.file);
  else { params.set("generator", "search"); params.set("gsrsearch", `${spec.query} filetype:bitmap`); params.set("gsrnamespace", "6"); params.set("gsrlimit", "15"); }
  return (mem[key] = fetch(`${API}?${params}`, { mode: "cors" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((j) => {
      const list = parse(j).slice(0, 6);
      const c: Cached = { ok: list.length > 0, list, at: Date.now() };
      try { localStorage.setItem(CK + key, JSON.stringify(c)); } catch { /* full */ }
      return c;
    })
    .catch(() => ({ ok: false, list: [], at: Date.now() }) as Cached)); // offline: not cached, try again next time
}

/** Markup for a photo slot. `fallback` = SVG illustration shown while loading (shimmer) and when no photo is available. */
export function realImage(spec: PhotoSpec, fallback: string, o: { ratio?: string; cls?: string } = {}) {
  const key = spec.file ? "f:" + spec.file : "q:" + (spec.query || "");
  return `<figure class="rimg loading ${o.cls || ""}" style="aspect-ratio:${o.ratio || "16/9"}" data-key="${esc(key)}" data-q="${esc(spec.query || "")}" data-f="${esc(spec.file || "")}">
    <div class="rimg-fb">${fallback}</div><figcaption class="rimg-cap"></figcaption></figure>`;
}

function show(fig: HTMLElement, c: Cached) {
  fig.classList.remove("loading");
  const key = fig.dataset.key!;
  if (!c.ok || !c.list.length) { fig.classList.add("fallback"); return; }
  const i = (pickIdx[key] || 0) % c.list.length, f = c.list[i];
  const img = new Image();
  img.alt = fig.dataset.q || f.title;
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  img.onload = () => { fig.classList.add("ready"); fig.classList.remove("fallback"); };
  img.onerror = () => { fig.classList.add("fallback"); img.remove(); };
  img.src = f.url;
  fig.querySelector("img")?.remove();
  fig.insertBefore(img, fig.querySelector(".rimg-cap"));
  const cap = fig.querySelector<HTMLElement>(".rimg-cap")!;
  cap.innerHTML = `<a href="${esc(f.page)}" target="_blank" rel="noopener noreferrer">${esc(f.artist.slice(0, 48))} · ${esc(f.license)} · Wikimedia Commons</a>`
    + (pickMode() ? `<span class="rimg-pick"><button onclick="A.imgNext(this)" aria-label="next">${icon("refresh", { size: 14 })}</button><button onclick="A.imgCopy(this)" data-file="${esc(f.title)}">imageFile</button></span>` : "");
}

/** Call after rendering: fills every photo slot inside root. */
export function hydrateImages(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("figure.rimg:not([data-h])").forEach((fig) => {
    fig.dataset.h = "1";
    const spec: PhotoSpec = { query: fig.dataset.q || undefined, file: fig.dataset.f || undefined };
    if (!spec.query && !spec.file) { fig.classList.remove("loading"); fig.classList.add("fallback"); return; }
    lookup(spec).then((c) => { if (fig.isConnected) show(fig, c); });
  });
}

reg({
  imgNext(btn: HTMLElement) {
    const fig = btn.closest<HTMLElement>("figure.rimg");
    if (!fig) return;
    const key = fig.dataset.key!;
    pickIdx[key] = (pickIdx[key] || 0) + 1;
    lookup({ query: fig.dataset.q || undefined, file: fig.dataset.f || undefined }).then((c) => show(fig, c));
  },
  imgCopy(btn: HTMLElement) {
    const line = `imageFile: "${btn.dataset.file}"`;
    navigator.clipboard?.writeText(line).then(() => { btn.textContent = "✓ copied"; }, () => prompt("Copy:", line));
    if (!navigator.clipboard) prompt("Copy:", line);
  },
});
