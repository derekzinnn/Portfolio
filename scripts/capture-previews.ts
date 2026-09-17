/**
 * Capture consistent project preview screenshots → public/previews/*.webp
 *
 *   pnpm previews:capture
 *
 * One-time prerequisite (downloads the headless browser):
 *   pnpm exec playwright install chromium
 *
 * Credentials are read from the environment - copy .env.example to .env.local
 * and fill it in. NEVER commit .env.local. Login selectors default to common
 * patterns; override via env if Inova's form differs.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";

// Load .env.local if present (Node >= 20.12). Falls back to the ambient env.
const proc = process as unknown as { loadEnvFile?: (p?: string) => void };
try {
  proc.loadEnvFile?.(".env.local");
} catch {
  /* no .env.local - rely on the real environment */
}

const OUT_DIR = path.join(process.cwd(), "public", "previews");
const VIEWPORT = { width: 1280, height: 800 }; // 16:10, matches the card frame

async function saveWebp(page: Page, file: string): Promise<void> {
  await page.waitForLoadState("networkidle").catch(() => {});
  const png = await page.screenshot({ type: "png" });
  await sharp(png)
    .resize(VIEWPORT.width, VIEWPORT.height, { fit: "cover", position: "top" })
    .webp({ quality: 82 })
    .toFile(path.join(OUT_DIR, file));
  console.log("✓ saved", `public/previews/${file}`);
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // crisp capture, downsampled by sharp
  });
  const page = await context.newPage();

  // --- Nic Crochet (public storefront) ---
  const nicUrl = process.env.PREVIEW_NIC_URL ?? "https://niccrochet.com.br";
  await page.goto(nicUrl, { waitUntil: "domcontentloaded" });
  await saveWebp(page, "nic-crochet.webp");

  // --- Inova Stok (login-gated → log in, then capture the real UI) ---
  const user = process.env.PREVIEW_INOVA_USER;
  const pass = process.env.PREVIEW_INOVA_PASS;
  if (user && pass) {
    const loginUrl =
      process.env.PREVIEW_INOVA_LOGIN_URL ?? "https://inova.derek.dev.br/login";
    const captureUrl =
      process.env.PREVIEW_INOVA_URL ?? "https://inova.derek.dev.br";
    const userSel =
      process.env.PREVIEW_INOVA_USER_SEL ??
      'input[type="email"], input[name="email"], input[name="username"], input[name="user"]';
    const passSel =
      process.env.PREVIEW_INOVA_PASS_SEL ?? 'input[type="password"]';
    const submitSel =
      process.env.PREVIEW_INOVA_SUBMIT_SEL ??
      'button[type="submit"], button:has-text("Entrar"), button:has-text("Login")';
    const readySel = process.env.PREVIEW_INOVA_READY_SEL;

    await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
    await page.locator(userSel).first().fill(user);
    await page.locator(passSel).first().fill(pass);
    await page.locator(submitSel).first().click();

    // Login is done when the password field leaves the DOM (form → app).
    await page
      .locator(passSel)
      .first()
      .waitFor({ state: "detached", timeout: 20000 })
      .catch(() => {});
    await page.waitForLoadState("networkidle").catch(() => {});

    // Only re-navigate if the capture URL differs from the login URL
    // (avoids bouncing an SPA back to its login screen).
    if (captureUrl && captureUrl !== loginUrl)
      await page.goto(captureUrl, { waitUntil: "networkidle" }).catch(() => {});
    if (readySel)
      await page.waitForSelector(readySel, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500); // let the UI settle
    await saveWebp(page, "inova-stok.webp");
  } else {
    console.warn(
      "! Skipping Inova Stok - set PREVIEW_INOVA_USER / PREVIEW_INOVA_PASS in .env.local",
    );
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
