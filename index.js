const puppeteer = require("puppeteer");
const path = require("path");
const { watch } = require("fs");
const { readFile } = require("fs/promises");

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
      fileName = "gen0" + linie.split("===")[1].replace(" ", "0");
    }
  }

  return { fileName, dataArray };
}

async function screenshot(browser, name, dataArray) {
  const page = await browser.newPage();

  await page.goto(path.join(__dirname, "index.html"), {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#tabelul");

  await page.evaluate((dataArray) => {
    const body = document.body;
    const len = dataArray.length;

    for (let i = 0; i < len; i++) {
      const slot = dataArray[i];

      body.innerHTML = body.innerHTML.replace(`slot${i}`, slot);
    }
  }, dataArray);

  const element = await page.$("#tabelul");

  console.log(`photos/${name}`);

  await element.screenshot({
    path: `photos/gen00ceva.png`,
  });

  await page.close();
}

function watchForData(browser) {
  const dataFile = "data.txt";
  let timeout;

  const watcher = watch(dataFile, async (eventName) => {
    if (!timeout) {
      timeout = setTimeout(() => (timeout = null), 5000); // 5s, sa nu se faca de mai multe ori un ss daca ai salvat o data

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
  console.log("started");

  console.log("starting puppeteer");
  const browser = await puppeteer.launch({
    // headless: false,
  });

  console.log("watching data.txt");
  watchForData(browser);

  // await browser.close();
})();
