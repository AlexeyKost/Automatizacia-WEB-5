const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { getText, clickElement } = require("../../lib/commands.js");
const {
  confirmBooking,
  getFreeRandomChair,
  selectDate,
  selectHall,
} = require("../../lib/util.js");

let freeChair;

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on cinema hall page", { timeout: 60 * 1000 }, async function () {
  await this.page.goto("http://qamid.tmweb.ru");
});

When(
  "user selects day {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    await selectDate(this.page, Number(string));
  }
);

When(
  "user selects hall {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    await selectHall(this.page, Number(string));
  }
);

When(
  "user selects {string} free chairs",
  { timeout: 60 * 1000 },
  async function (string) {
    for (let i = 0; i < Number(string); i++) {
      freeChair = await getFreeRandomChair(this.page);
      await clickElement(this.page, freeChair);
    }
  }
);

When("user confirms booking", { timeout: 60 * 1000 }, async function () {
  return await confirmBooking(this.page);
});

When("user return to cinema hall", { timeout: 60 * 1000 }, async function () {
  await this.page.goto("http://qamid.tmweb.ru");
});

When("user selects same chair", { timeout: 60 * 1000 }, async function () {
  await clickElement(this.page, freeChair);
});

Then(
  "user get the QR and {string} places",
  { timeout: 60 * 1000 },
  async function (string) {
    const actual = await confirmBooking(this.page);
    const chairsQuantity = await Number(string);
    expect(actual).contains("ticket__info-qr");
    let chairs = (await getText(this.page, "p:nth-child(2) > span")).split(
      ", "
    );
    expect(chairs.length).equal(chairsQuantity);
  }
);

Then(
  "user get the QR with selector {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    const actual = await confirmBooking(this.page);
    const expected = await string;
    expect(actual).contains(expected);
  }
);

Then(
  "user can't book and chair selector is {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    let className = await this.page.$eval(freeChair, (el) => el.classList[2]);
    expect(className).contains(string);
  }
);
