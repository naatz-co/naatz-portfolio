// Post-processes the HTML exported from Framer (raw/*.html) at build time:
// - swaps PNG/JPG for the optimized WebP versions and adds width/height (no layout shift)
// - keeps a single <h1> per page and turns long "headings" (body copy) into <p>
// - makes large paddings/gaps responsive through the --s scale variable
import meta from '../data/images.json';
import boxesJson from '../data/framer-boxes.json';
const boxes = boxesJson as Record<string, [number, number, string]>;

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

// Gives each image/video the exact box it has on the Framer site (aspect ratio, max width, cover/contain).
function fixBoxes(html: string) {
  return html
    .replace(/<figure class="img([^"]*)"(?: style="([^"]*)")?><img src="\/images\/([^"]+)"/g, (all, cls: string, style = '', file: string) => {
      const b = boxes[file];
      if (!b) return all;
      const st = [style.replace(/(^|;)max-width:[^;]*/g, ''), `aspect-ratio:${b[0]}/${b[1]}`, `max-width:${b[0]}px`, `--fit:${b[2]}`].filter(Boolean).join(';').replace(/^;/, '');
      return `<figure class="img box${cls}" style="${st}"><img src="/images/${file}"`;
    })
    .replace(/<video class="vid" src="\/videos\/([^"]+)"([^>]*?)style="width:[^"]*"/g, (all, file: string, rest: string) => {
      const b = boxes[file];
      return b ? `<video class="vid box" src="/videos/${file}"${rest}style="width:100%;max-width:${b[0]}px;aspect-ratio:${b[0]}/${b[1]};object-fit:${b[2]}"` : all;
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

// Framer appear effects on case pages: text/sections rise 50px + fade (0.8s), images also zoom 1.1 -> 1.
function addMotion(html: string) {
  return html
    .replace(/<div class="t( |")/g, '<div data-a="up" class="t$1')
    .replace(/<figure class="img/g, '<figure data-a="up" class="img')
    .replace(/<div class="(video|tk|slides[^"]*)"/g, '<div data-a="up" class="$1"')
    .replace(/<video class="vid/g, '<video data-a="up" class="vid')
    .replace(/<div class="col stat"/g, '<div data-a="up" class="col stat"')
    .replace(/<div class="tabs">/g, '<div data-a="up" class="tabs" style="--d:.6s">');
}

export function transform(html: string) {
  return addMotion(fixSpacing(fixHeadings(fixImages(fixBoxes(html)))));
}
