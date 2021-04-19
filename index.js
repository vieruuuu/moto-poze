const puppeteer = require("puppeteer");
const { downloadBrowser } = require("puppeteer/lib/cjs/puppeteer/node/install");

const path = require("path");
const { watch } = require("fs");
const { readFile, mkdir } = require("fs/promises");

async function getData(dataFile) {
  const rawData = await readFile(dataFile, { encoding: "utf-8" });

  let dataArray = [];
  let fileName = "";

  const linii = rawData.split("\n");
  const len = linii.length;

  for (let i = 0; i < len; i++) {
    const linie = linii[i];

    if (linie.includes(":::")) {
      const slot = linie.split(":::")[1];

      dataArray.push(slot);
    } else if (linie.includes("===")) {
      fileName = "gen_" + linie.split("===")[1].replace(" ", "_") + ".png";
    }
  }

  return { fileName, dataArray };
}

async function screenshot(browser, name, dataArray) {
  const page = await browser.newPage();

  await page.goto("file://" + path.join(__dirname, "index.html"), {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#tabelul");

  let body = await page.content();
  const len = dataArray.length;

  for (let i = 0; i < len; i++) {
    const slot = dataArray[i];

    body = body.replace(`$$slot${i}`, slot);
  }

  await page.setContent(body, { waitUntil: "networkidle0" });

  const element = await page.$("#tabelul");

  const savePath = path.join(__dirname, "photos", name);

  await element.screenshot({
    path: savePath,
  });

  await page.close();
}

function watchForData(browser) {
  const dataFile = "data.txt";
  let timeout;

  const watcher = watch(dataFile, async (eventName) => {
    if (!timeout) {
      timeout = setTimeout(() => (timeout = null), 2000); // sa nu se faca de mai multe ori un ss daca ai salvat o data

      if (eventName === "change") {
        console.log("citesc datele");
        const { fileName, dataArray } = await getData(dataFile);
        console.log("gata datele");

        console.log("creez poza");
        await screenshot(browser, fileName, dataArray);
        console.log("poza gata");
      }
    }
  });
}

(async () => {
  await mkdir("./node_modules/puppeteer/.local-chromium", { recursive: true });

  await downloadBrowser();

  console.log("started");

  console.log("starting puppeteer");
  const browser = await puppeteer.launch({
    // headless: false,
  });

  console.log("watching data.txt");
  watchForData(browser);

  // await browser.close();
})();
