// Render scripts/og-template.html to a 1200x630 PNG for social sharing.
// Usage: NODE_PATH="$(npm root -g)" node scripts/make_og.js
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const templatePath = "file://" + path.resolve(__dirname, "og-template.html");
  const outPath = path.resolve(__dirname, "..", "og-image.png");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2, // retina-crisp; platforms scale the 2400x1260 down
  });
  await page.goto(templatePath, { waitUntil: "networkidle" });
  // Give the web font a moment to settle.
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(300);

  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log("wrote", outPath);
})();
