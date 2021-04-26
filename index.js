const puppeteer = require("puppeteer");
const { downloadBrowser } = require("puppeteer/lib/cjs/puppeteer/node/install");

const { green, red } = require("chalk");

// pt loguri mai smechere
require("console-stamp")(console);

const readline = require("readline");

const path = require("path");
const { watch } = require("fs");
const { readFile, mkdir, writeFile, readdir } = require("fs/promises");

// proate am nev de asta candva si o las aici
const isDev = process.env.DEV === "true";

// asta e modelul de fisier data.txt
const DATA = `
=== numefisier

0: Nume :::  CROSS nexter
1: Pret ::: 2.100 RON
2: Poza ::: https://www.moto-velo-sport.ro/image/cache/catalog/cross%20dexter%20albastru-1500x1500w.png
 
3: Disciplina :::  MTB
4: Dimensiune roata ::: 26''
5: Transmisie ::: 3x8 viteze
6: Suspensie ::: Suntour XCM Lock-out 26"
 
7: Schimbator pinioane ::: Shimano Altus
8: Schimbator foi ::: Shimano Tourney
9: Manete schimbator ::: Shimano Altus M310
10: Angrenaj ::: Shimano Tourney FC-TY301
11: Pinioane ::: Shimano Tourney MF-TZ500asd
12: Lant ::: KMC Z7
13: Monobloc ::: -
 
14: Tip frana ::: Disc > hidraulica
15: Model ::: Shimano BR-M200
 
16: Anvelope ::: Kenda K-Rad 26x2.30
17: Jante ::: Crosser X14 26''
18: Butuc fata ::: Joy Tech
19: Butuc spate ::: Joy Tech
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

async function screenshot(browser, template, name, dataArray) {
  const page = await browser.newPage();

  await page.goto("file://" + path.join(__dirname, template), {
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

function watchForData(browser, template) {
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
        await screenshot(browser, template, fileName, dataArray);
        console.log(`(${fileName}) poza gata`);
      }
    }
  });
}

async function templatePicker() {
  console.log("pick template");

  const files = await readdir(".");
  let htmlFiles = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.includes(".html")) {
      htmlFiles += file + " ";
    }
  }

  console.log(green(htmlFiles));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  for await (const line of rl) {
    if (files.includes(line)) {
      console.log("using " + green(line) + " template");
      return line;
    } else {
      console.log(red("type a file from this list"));
    }
  }
}

(async () => {
  console.log("starting");

  const template = await templatePicker();

  await Promise.all([
    mkdir("./node_modules/puppeteer/.local-chromium", { recursive: true }),
    mkdir("./photos", { recursive: true }),
    writeFile("data.txt", DATA, { encoding: "utf-8" }),
  ]);

  await downloadBrowser();

  console.log("setup done");

  console.log("starting puppeteer");
  const browser = await puppeteer.launch({
    // headless: false,
  });
  console.log("started puppeteer");

  console.log("watching data.txt");
  watchForData(browser, template);

  // await browser.close();
})();
