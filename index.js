const puppeteer = require("puppeteer");
const path = require("path");

async function screenshot(browser, name) {
  const page = await browser.newPage();

  await page.goto(path.join(__dirname, "index.html"), {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#tabelul");

  const element = await page.$("#tabelul");

  await element.screenshot({
    path: `photos/${name}.png`,
  });

  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({
    // headless: false,
  });

  await screenshot(browser, "example");

  await browser.close();
}

main();
