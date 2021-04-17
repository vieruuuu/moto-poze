const puppeteer = require("puppeteer");

async function screenshot(browser, url, name) {
  const page = await browser.newPage();

  await page.setViewport({ width: 491, height: 755 }); // 13cm x 20cm

  await page.goto(url);

  await page.screenshot({ path: `photos/${name}.png` });

  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  await screenshot(browser, "https://example.com", "example");

  await browser.close();
}

main();
