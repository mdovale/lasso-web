/**
 * Generates the computer-generated artwork in public/generated/:
 *
 *   - interference.svg  two-source interference fringe field
 *   - resonator.svg     monolithic resonator line art
 *   - odin.svg          cubic accelerometer configuration wireframe
 *   - dfmi.svg          frequency-modulated waveform
 *   - lisa.svg          LISA triangular constellation
 *   - og-image.png      1200x630 social preview card
 *
 * The generated files are committed to the repository, so this script only
 * needs to be re-run when the artwork should change:
 *
 *     npm run generate:graphics
 *
 * Everything is derived from the same palette as app/globals.css.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const OUT_DIR = path.join(process.cwd(), "public", "generated");

// Palette (see app/globals.css @theme tokens)
const INK = "#0a0f1e";
const LINE = "#1d2742";
const SKY = "#81d3eb";
const OASIS = "#378dbd";
const ACCENT = "#ef4056";
const FG = "#f2f1ec";

const W = 1280;
const H = 800;

function svgDoc(body: string, width = W, height = H): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<rect width="${width}" height="${height}" fill="${INK}"/>
${body}
</svg>
`;
}

function writeSvg(name: string, body: string, width = W, height = H): void {
  fs.writeFileSync(path.join(OUT_DIR, name), svgDoc(body, width, height));
  console.log(`  ✓ public/generated/${name}`);
}

/* ---------- interference.svg ---------- */

function interference(): string {
  const sources = [
    { x: W * 0.34, y: H * 0.5, color: SKY },
    { x: W * 0.66, y: H * 0.5, color: OASIS },
  ];
  const rings: string[] = [];
  const spacing = 26;
  for (const s of sources) {
    for (let i = 1; i <= 34; i++) {
      const r = i * spacing;
      const opacity = Math.max(0.04, 0.5 - i * 0.014).toFixed(3);
      rings.push(
        `<circle cx="${s.x}" cy="${s.y}" r="${r}" fill="none" stroke="${s.color}" stroke-width="1.1" opacity="${opacity}"/>`,
      );
    }
    rings.push(`<circle cx="${s.x}" cy="${s.y}" r="4" fill="${ACCENT}"/>`);
  }
  return rings.join("\n");
}

/* ---------- resonator.svg ---------- */

function resonator(): string {
  const cx = W / 2;
  const cy = H / 2;
  const parts: string[] = [];

  // Outer frame with rounded corners
  parts.push(
    `<rect x="${cx - 340}" y="${cy - 240}" width="680" height="480" rx="28" fill="none" stroke="${SKY}" stroke-width="2.5"/>`,
    `<rect x="${cx - 300}" y="${cy - 200}" width="600" height="400" rx="18" fill="none" stroke="${LINE}" stroke-width="1.5"/>`,
  );

  // Test mass
  parts.push(
    `<rect x="${cx - 120}" y="${cy - 120}" width="240" height="240" rx="10" fill="${LINE}" fill-opacity="0.45" stroke="${SKY}" stroke-width="2"/>`,
  );

  // Flexures: thin S-curves connecting mass to frame, top and bottom
  for (const side of [-1, 1]) {
    for (const offset of [-70, 70]) {
      const x = cx + offset;
      const y1 = cy + side * 120;
      const y2 = cy + side * 200;
      parts.push(
        `<path d="M ${x} ${y1} C ${x - 26} ${y1 + side * 26}, ${x + 26} ${y2 - side * 26}, ${x} ${y2}" fill="none" stroke="${OASIS}" stroke-width="2.5"/>`,
      );
    }
  }

  // Laser readout beam through the mass
  parts.push(
    `<line x1="${cx - 340}" y1="${cy}" x2="${cx + 340}" y2="${cy}" stroke="${ACCENT}" stroke-width="2" stroke-dasharray="2 10" opacity="0.9"/>`,
    `<circle cx="${cx}" cy="${cy}" r="7" fill="none" stroke="${ACCENT}" stroke-width="2"/>`,
    `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${ACCENT}"/>`,
  );

  // Dimension ticks, instrument-drawing style
  parts.push(
    `<line x1="${cx - 340}" y1="${cy + 280}" x2="${cx + 340}" y2="${cy + 280}" stroke="${LINE}" stroke-width="1"/>`,
    `<line x1="${cx - 340}" y1="${cy + 270}" x2="${cx - 340}" y2="${cy + 290}" stroke="${LINE}" stroke-width="1"/>`,
    `<line x1="${cx + 340}" y1="${cy + 270}" x2="${cx + 340}" y2="${cy + 290}" stroke="${LINE}" stroke-width="1"/>`,
  );
  return parts.join("\n");
}

/* ---------- odin.svg ---------- */

function odin(): string {
  // Isometric cube wireframe with sensing axes on the edges.
  const cx = W / 2;
  const cy = H / 2 + 20;
  const s = 220; // half edge in projection

  // Isometric projection of cube corners (x, y, z in {-1, 1})
  const project = (x: number, y: number, z: number): [number, number] => [
    cx + (x - y) * s * 0.86,
    cy + (x + y) * s * 0.5 - z * s * 0.9,
  ];

  const corners: Record<string, [number, number]> = {};
  for (const x of [0, 1])
    for (const y of [0, 1])
      for (const z of [0, 1])
        corners[`${x}${y}${z}`] = project(x * 2 - 1, y * 2 - 1, z * 2 - 1);

  const edges = [
    ["000", "100"], ["000", "010"], ["000", "001"],
    ["100", "110"], ["100", "101"], ["010", "110"],
    ["010", "011"], ["001", "101"], ["001", "011"],
    ["110", "111"], ["101", "111"], ["011", "111"],
  ];

  const parts: string[] = [];
  edges.forEach(([a, b], i) => {
    const [x1, y1] = corners[a];
    const [x2, y2] = corners[b];
    parts.push(
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${LINE}" stroke-width="1.5"/>`,
    );
    // Sensing axis: a short accent segment centered on each edge
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = (x2 - x1) / 6;
    const dy = (y2 - y1) / 6;
    const color = i % 3 === 0 ? ACCENT : i % 3 === 1 ? SKY : OASIS;
    parts.push(
      `<line x1="${(mx - dx).toFixed(1)}" y1="${(my - dy).toFixed(1)}" x2="${(mx + dx).toFixed(1)}" y2="${(my + dy).toFixed(1)}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`,
      `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="4.5" fill="${INK}" stroke="${color}" stroke-width="2"/>`,
    );
  });

  for (const key of Object.keys(corners)) {
    const [x, y] = corners[key];
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${FG}" opacity="0.7"/>`,
    );
  }
  return parts.join("\n");
}

/* ---------- dfmi.svg ---------- */

function dfmi(): string {
  // A deeply frequency-modulated sinusoid: phase(t) = w0 t + m sin(wm t)
  const parts: string[] = [];
  const mid = H / 2;
  const amp = H * 0.28;
  const points: string[] = [];
  const n = 900;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const phase = 2 * Math.PI * (26 * t) + 9 * Math.sin(2 * Math.PI * 1.5 * t);
    const x = t * W;
    const y = mid - amp * Math.sin(phase) * (0.35 + 0.65 * Math.sin(Math.PI * t) ** 0.6);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  parts.push(
    `<polyline points="${points.join(" ")}" fill="none" stroke="${SKY}" stroke-width="2"/>`,
  );

  // Slow modulation envelope
  const envelope: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const x = t * W;
    const y = mid - amp * (0.35 + 0.65 * Math.sin(Math.PI * t) ** 0.6);
    envelope.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  parts.push(
    `<polyline points="${envelope.join(" ")}" fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.8"/>`,
  );

  // Baseline
  parts.push(
    `<line x1="0" y1="${mid}" x2="${W}" y2="${mid}" stroke="${LINE}" stroke-width="1"/>`,
  );
  return parts.join("\n");
}

/* ---------- lisa.svg ---------- */

function lisa(): string {
  const cx = W / 2;
  const cy = H / 2 + 30;
  const R = 250;
  const parts: string[] = [];

  // Faint orbit circle
  parts.push(
    `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${LINE}" stroke-width="1" stroke-dasharray="3 9"/>`,
  );

  // Three spacecraft at triangle vertices
  const craft: [number, number][] = [0, 1, 2].map((i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    return [cx + R * Math.cos(angle), cy + R * Math.sin(angle)];
  });

  // Laser links (double lines, slightly offset)
  for (let i = 0; i < 3; i++) {
    const [x1, y1] = craft[i];
    const [x2, y2] = craft[(i + 1) % 3];
    const nx = ((y2 - y1) / R) * 5;
    const ny = ((x1 - x2) / R) * 5;
    parts.push(
      `<line x1="${x1 + nx}" y1="${y1 + ny}" x2="${x2 + nx}" y2="${y2 + ny}" stroke="${SKY}" stroke-width="1.6" opacity="0.9"/>`,
      `<line x1="${x1 - nx}" y1="${y1 - ny}" x2="${x2 - nx}" y2="${y2 - ny}" stroke="${OASIS}" stroke-width="1.6" opacity="0.9"/>`,
    );
  }

  // Spacecraft markers
  for (const [x, y] of craft) {
    parts.push(
      `<circle cx="${x}" cy="${y}" r="26" fill="${INK}" stroke="${LINE}" stroke-width="1.5"/>`,
      `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${SKY}" stroke-width="2"/>`,
      `<circle cx="${x}" cy="${y}" r="3.5" fill="${ACCENT}"/>`,
    );
  }

  // Background stars (deterministic pseudo-random)
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 90; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = rand() * 1.3 + 0.3;
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${FG}" opacity="${(rand() * 0.4 + 0.1).toFixed(2)}"/>`,
    );
  }
  return parts.join("\n");
}

/* ---------- og-image.png ---------- */

// Minimal PNG encoder (truecolor, no external dependencies).
function encodePng(width: number, height: number, rgb: Uint8Array): Buffer {
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c;
  }
  const crc32 = (buf: Buffer): number => {
    let c = -1;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
  const chunk = (type: string, data: Buffer): Buffer => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor
  // filter byte (0) at the start of each scanline
  const raw = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    raw[rowStart] = 0;
    rgb.subarray(y * width * 3, (y + 1) * width * 3).forEach((v, i) => {
      raw[rowStart + 1 + i] = v;
    });
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function ogImage(): void {
  const width = 1200;
  const height = 630;
  const rgb = new Uint8Array(width * height * 3);

  // Interference field of two sources, same math as the homepage hero.
  const sources = [
    { x: width * 0.3, y: height * 0.55, phase: 0 },
    { x: width * 0.72, y: height * 0.4, phase: 2.1 },
  ];
  const k = (2 * Math.PI) / 42;

  const ink = [5, 7, 15];
  const sky = [129, 211, 235];
  const oasis = [55, 141, 189];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let field = 0;
      for (const s of sources) {
        field += Math.cos(k * Math.hypot(x - s.x, y - s.y) - s.phase);
      }
      const norm = field / sources.length; // -1..1
      const intensity = norm * norm;
      // Vignette so the pattern fades toward the edges
      const vx = (x / width - 0.5) * 2;
      const vy = (y / height - 0.5) * 2;
      const vignette = Math.max(0, 1 - (vx * vx + vy * vy) * 0.55);
      const a = Math.min(1, intensity * 0.5 * vignette);
      const tint = norm > 0 ? sky : oasis;
      const idx = (y * width + x) * 3;
      for (let c = 0; c < 3; c++) {
        rgb[idx + c] = Math.round(ink[c] + (tint[c] - ink[c]) * a);
      }
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "og-image.png"), encodePng(width, height, rgb));
  console.log("  ✓ public/generated/og-image.png");
}

/* ---------- main ---------- */

fs.mkdirSync(OUT_DIR, { recursive: true });
console.log("Generating artwork...\n");
writeSvg("interference.svg", interference());
writeSvg("resonator.svg", resonator());
writeSvg("odin.svg", odin());
writeSvg("dfmi.svg", dfmi());
writeSvg("lisa.svg", lisa());
ogImage();
console.log("\nDone.");
