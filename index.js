const puppeteer = require("puppeteer");
const { downloadBrowser } = require("puppeteer/lib/cjs/puppeteer/node/install");

// pt loguri mai smechere
require("console-stamp")(console);

const path = require("path");
const { watch } = require("fs");
const { readFile, mkdir, writeFile } = require("fs/promises");

// proate am nev de asta candva si o las aici
const isDev = process.env.DEV === "true";

// asta e modelul de fisier data.txt
const DATA = `
Nume :::  CROSS nexter
Pret ::: 2.100 RON
Poza ::: https://www.moto-velo-sport.ro/image/cache/catalog/cross%20dexter%20albastru-1500x1500w.png

Disciplina :::  MTB
Dimensiune roata ::: 26''
Transmisie ::: 3x8 viteze
Suspensie ::: Suntour XCM Lock-out 26"

Schimbator pinioane ::: Shimano Altus
Schimbator foi ::: Shimano Tourney
Manete schimbator ::: Shimano Altus M310
Angrenaj ::: Shimano Tourney FC-TY301
Pinioane ::: Shimano Tourney MF-TZ500asd
Lant ::: KMC Z7
Monobloc ::: -

Tip frana ::: Disc > hidraulica
Model ::: Shimano BR-M200

Anvelope ::: Kenda K-Rad 26x2.30
Jante ::: Crosser X14 26''
Butuc fata ::: Joy Tech
Butuc spate ::: Joy Tech

=== numefisier
`;

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
  console.log("starting");

  await Promise.all([
    mkdir("./node_modules/puppeteer/.local-chromium", { recursive: true }),
    mkdir("./photos", { recursive: true }),
    writeFile("data.txt", DATA),
  ]);

  await downloadBrowser();

  console.log("setup done");

  console.log("starting puppeteer");
  const browser = await puppeteer.launch({
    // headless: false,
  });

  console.log("started puppeteer");

  console.log("watching data.txt");
  watchForData(browser);

  // await browser.close();
})();
