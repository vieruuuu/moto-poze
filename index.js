const puppeteer = require("puppeteer");
const path = require("path");

async function screenshot(browser, name, data) {
  const page = await browser.newPage();

  await page.goto(path.join(__dirname, "index.html"), {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#tabelul");

  await page.evaluate(() => {
    const body = document.body;

    for (let i = 0; i < 20; i++) {
      body.innerHTML = body.innerHTML.replace(`slot${i}`, `replaced${i}`);
    }
  });

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
