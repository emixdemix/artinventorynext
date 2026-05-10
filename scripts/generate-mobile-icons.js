/* eslint-disable */
// One-shot script to generate Expo app icons from logosmall.svg.
// Run from /Users/emilio/work/artinventorynext/frontend with `node scripts/generate-mobile-icons.js`.

const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const SVG_PATH = '/Users/emilio/work/artinventorynext/frontend/public/images/logosmall.svg';
const OUT_DIR = '/Users/emilio/work/artinventory-app/assets/images';

const RED = '#D90429';

async function makeIcon({ size, bg, insetRatio, out }) {
  const svg = fs.readFileSync(SVG_PATH, 'utf8');
  const logoSize = Math.round(size * insetRatio);
  const logoBuf = await sharp(Buffer.from(svg), { density: 768 })
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const base = bg
    ? sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: bg,
        },
      })
    : sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      });

  await base
    .composite([{ input: logoBuf, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT_DIR, out));

  console.log(`  wrote ${out} (${size}x${size})`);
}

async function makeSolid({ size, bg, out }) {
  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .png()
    .toFile(path.join(OUT_DIR, out));
  console.log(`  wrote ${out} (${size}x${size}, solid ${bg})`);
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    throw new Error(`OUT_DIR does not exist: ${OUT_DIR}`);
  }
  if (!fs.existsSync(SVG_PATH)) {
    throw new Error(`SVG_PATH does not exist: ${SVG_PATH}`);
  }

  console.log('Generating Expo app icons...');

  // Main app icon: solid red bg, white logo at 62% inset.
  await makeIcon({ size: 1024, bg: RED, insetRatio: 0.62, out: 'icon.png' });

  // Web favicon: same look, smaller size.
  await makeIcon({ size: 48, bg: RED, insetRatio: 0.7, out: 'favicon.png' });

  // Splash icon: white logo on transparent (splash plugin paints the bg).
  await makeIcon({ size: 1024, bg: null, insetRatio: 0.7, out: 'splash-icon.png' });

  // Android adaptive icon background: solid red, no logo (foreground is layered on top by the OS).
  await makeSolid({ size: 1024, bg: RED, out: 'android-icon-background.png' });

  // Android adaptive icon foreground: logo on transparent, with extra inset for the safe zone (~50%).
  await makeIcon({
    size: 1024,
    bg: null,
    insetRatio: 0.5,
    out: 'android-icon-foreground.png',
  });

  // Android monochrome icon: logo on transparent (the OS tints non-transparent pixels for themed icons).
  await makeIcon({
    size: 1024,
    bg: null,
    insetRatio: 0.5,
    out: 'android-icon-monochrome.png',
  });

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
