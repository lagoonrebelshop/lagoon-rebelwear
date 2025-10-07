const fs = require('fs');
const sharp = require('sharp');

const OUT = 'public/og.jpg';
const W = 1200, H = 630;

// gradiente verticale scuro
const top = { r: 10, g: 10, b: 12 };
const bottom = { r: 30, g: 30, b: 36 };

const gradient = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const r = Math.round(top.r * (1 - t) + bottom.r * t);
  const g = Math.round(top.g * (1 - t) + bottom.g * t);
  const b = Math.round(top.b * (1 - t) + bottom.b * t);
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 3;
    gradient[idx] = r; gradient[idx+1] = g; gradient[idx+2] = b;
  }
}
const background = sharp(gradient, { raw: { width: W, height: H, channels: 3 } });

(async () => {
  const layers = [];

  // bordo bianco semi-trasparente
  const border = Buffer.alloc(W * H * 4, 0);
  const bw = 6;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (x < bw || x >= W - bw || y < bw || y >= H - bw) {
      const i = (y * W + x) * 4;
      border[i] = 255; border[i+1] = 255; border[i+2] = 255; border[i+3] = 90;
    }
  }
  layers.push({ input: border, raw: { width: W, height: H, channels: 4 } });

  const logoPath = 'public/Logo.png';
  if (fs.existsSync(logoPath)) {
    // Riduci dentro un box sicuro (80% della canvas)
    const maxW = Math.floor(W * 0.8);
    const maxH = Math.floor(H * 0.8);
    const logoBuf = await sharp(logoPath)
      .resize(maxW, maxH, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    layers.push({
      input: logoBuf,
      gravity: 'center',   // <-- niente top/left, lo centra Sharp
    });
  } else {
    const svg = `
      <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .t{fill:#fff;font-weight:800;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
          .a{fill:#cfd6dd;font-weight:500;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
        </style>
        <text x="60" y="320" font-size="88" class="t">LAGOON REBEL WEAR</text>
        <text x="60" y="380" font-size="36" class="a">Venezia — Streetwear ribelle</text>
      </svg>`;
    layers.push({ input: Buffer.from(svg) });
  }

  await background
    .composite(layers)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(OUT);

  console.log(`✅ Generated ${OUT} (${W}x${H})`);
})().catch((e) => { console.error(e); process.exit(1); });
