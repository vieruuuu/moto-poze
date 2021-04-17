const puppeteer = require("puppeteer");
const path = require("path");

async function screenshot(browser, name) {
  const page = await browser.newPage();

  await page.setViewport({ width: 491, height: 755 }); // 13cm x 20cm

  await page.goto(path.join(__dirname, "index.html"));

  await page.screenshot({ path: `photos/${name}.png` });

  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  await screenshot(browser, "example");

  await browser.close();
}

main();
