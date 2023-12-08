const { clickElement, putText, getText } = require("./lib/commands.js");
const { generateName } = require("./lib/util.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("Go to movies tests", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/");
  });

  test("Бронирование билета на фильм Зверополис", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(page, ".movie-seances__hall a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(6)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await getText(page, `div > p:nth-child(1) > span`);
    const numberOfparagraph = 6;
    let resultText = [];
    for (let i = 1; i < numberOfparagraph; i++) {
      try {
        let text = await getText(page, `div > p:nth-child(${i}) > span`);
        resultText.push(text);
      } catch (e) {
        console.error(`Error while getting text for paragraph ${i}`, e);
      }
    }
    const actual = resultText;
    const expected = ["Зверополис", "3/6", "Зал 2", "20-10-2023", "11:00"];
    expect(actual).toEqual(expected);
  }, 50000);

  test("Покупка нескольких билетов на фильм Унесенные ветром", async () => {
    await clickElement(page, "a:nth-child(3)");
    await clickElement(page, ".movie-seances__hall a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    let place4 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(4)";
    let place5 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(5)";
    let place6 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(6)";
    let place7 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(7)";
    let place8 = ".buying-scheme__wrapper > :nth-child(7) > :nth-child(8)";
    await clickElement(page, place4);
    await clickElement(page, place5);
    await clickElement(page, place6);
    await clickElement(page, place7);
    await clickElement(page, place8);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await getText(page, `div > p:nth-child(1) > span`);
    const numberOfparagraph = 6;
    let resultText = [];
    for (let i = 1; i < numberOfparagraph; i++) {
      try {
        let text = await getText(page, `div > p:nth-child(${i}) > span`);
        resultText.push(text);
      } catch (e) {
        console.error(`Error while getting text for paragraph ${i}`, e);
      }
    }
    const actual = resultText;
    const expected = await [
      "Зверополис",
      "7/4, 7/5, 7/6, 7/7, 7/8",
      "Зал 2",
      "22-10-2023",
      "11:00",
    ];
    expect(actual).toEqual(expected);
  }, 50000);

  test("Покупка билета на место в зале просмотра фильма Унесенные ветром, которое уже занято ", async () => {
    await clickElement(page, "a:nth-child(4)");
    await clickElement(page, "div:nth-child(3) a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(8) > :nth-child(3)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await clickElement(page, "button");
    const electroTicket = "h2";
    await page.waitForSelector(electroTicket);
    await page.goto("https://qamid.tmweb.ru/");
    await clickElement(page, "a:nth-child(4)");
    await clickElement(page, "div:nth-child(3) a");
    await page.waitForSelector(byuingSchema);
    const isTaken = await page.$eval(place, (el) =>
      el.classList.contains("buying-scheme__chair_taken")
    );
    let actual;
    if (isTaken) {
      actual = await getText(page, "div:nth-child(2) > p:nth-child(1)");
    } else {
      await clickElement(page, place);
    }
    const actualTrim = actual.trim();
    const expected = "Занято";
    expect(actualTrim).toEqual(expected);
  }, 60000);
});