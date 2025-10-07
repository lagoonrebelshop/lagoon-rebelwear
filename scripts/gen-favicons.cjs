const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

const SRC = path.join('public', 'Logo.png');
if (!fs.existsSync(SRC)) {
  console.error('❌ public/Logo.png non trovato. Metti il logo lì e rilancia.');
  process.exit(1);
}

async function run() {
  // 1) Genera PNG necessari
  const outApple = path.join('public', 'apple-touch-icon.png');
  const out32 = path.join('public', 'favicon-32x32.png');
  const out16 = path.join('public', 'favicon-16x16.png');

  await sharp(SRC).resize(180, 180).png({ quality: 92 }).toFile(outApple);
  await sharp(SRC).resize(32, 32).png({ quality: 92 }).toFile(out32);
  await sharp(SRC).resize(16, 16).png({ quality: 92 }).toFile(out16);

  // 2) Crea favicon.ico multi-size (16+32) dai PNG
  const buf16 = fs.readFileSync(out16);
  const buf32 = fs.readFileSync(out32);
  const icoBuffer = await toIco([buf16, buf32]);

  fs.writeFileSync(path.join('public', 'favicon.ico'), icoBuffer);

  console.log('✅ Favicons generati in public/:');
  console.log('   - apple-touch-icon.png (180x180)');
  console.log('   - favicon-32x32.png (32x32)');
  console.log('   - favicon-16x16.png (16x16)');
  console.log('   - favicon.ico (16+32)');
}

run().catch(e => { console.error(e); process.exit(1); });
