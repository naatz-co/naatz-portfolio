// Post-processes the HTML exported from Framer (raw/*.html) at build time:
// - swaps PNG/JPG for the optimized WebP versions and adds width/height (no layout shift)
// - keeps a single <h1> per page and turns long "headings" (body copy) into <p>
// - makes large paddings/gaps responsive through the --s scale variable
import meta from '../data/images.json';

type Meta = Record<string, { w: number; h: number; webp?: boolean }>;
const images = meta as Meta;

export function imgAttrs(file: string) {
  const m = images[file];
  const src = m?.webp ? `/images/${file.replace(/\.(png|jpe?g)$/i, '.webp')}` : `/images/${file}`;
  return { src, width: m?.w, height: m?.h };
}

function fixImages(html: string) {
  return html.replace(/<img src="\/images\/([^"]+)"([^>]*)>/g, (_all, file: string, rest: string) => {
    const { src, width, height } = imgAttrs(file);
    const size = width && height && !/\swidth=/.test(rest) ? ` width="${width}" height="${height}"` : '';
    return `<img src="${src}"${size}${rest}>`;
  });
}

function fixHeadings(html: string) {
  let seenH1 = false;
  return html.replace(/<(h[1-6])>([\s\S]*?)<\/\1>/g, (_all, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (text.length > 110) return `<p>${inner}</p>`; // body copy that was styled as a heading
    if (tag === 'h1') {
      if (!seenH1) { seenH1 = true; return `<h1>${inner}</h1>`; }
      return `<h2>${inner}</h2>`;
    }
    return `<${tag}>${inner}</${tag}>`;
  });
}

const scalePx = (v: string) =>
  v.replace(/(\d+(?:\.\d+)?)px/g, (m, n) => (parseFloat(n) >= 24 ? `calc(${n}px*var(--s))` : m));

function fixSpacing(html: string) {
  return html.replace(/(padding|gap):([^;"]+)/g, (_m, prop: string, val: string) => `${prop}:${scalePx(val)}`);
}

export function transform(html: string) {
  return fixSpacing(fixHeadings(fixImages(html)));
}
