import { chromium } from "playwright-core";

export async function convert(html: string) {
  const document = `<html><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); * { font-family: 'Noto Sans', sans-serif; }</style><body>${html}</body></html>`;

  const browser = await chromium.launch({
    channel: "chrome",
    args: ["--disable-web-security"],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  await page.setContent(document, { waitUntil: "networkidle" });
  return await page.screenshot({
    type: "png",
    clip: {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    },
  });
}
