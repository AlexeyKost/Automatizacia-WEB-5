const { clickElement } = require("./commands.js");

module.exports = {
  getRandomChairSelector: function (rows, chairsInRow) {
    let row = Math.round(Math.random() * (rows - 1)) + 1;
    let chair = Math.round(Math.random() * (chairsInRow - 1)) + 1;
    return "div:nth-child(" + row + ") > span:nth-child(" + chair + ")";
  },

  confirmBooking: async function (page) {
    // подтверждение брони, возвращение селектора от QR-кода
    await clickElement(page, "button");
    await page.waitForSelector("h2");
    await clickElement(page, "button");
    await page.waitForSelector("img");
    const imgClassName = await page.$eval("img", (el) => el.className);
    return imgClassName;
  },

  getFreeRandomChair: async function (page) {
    // выбор свободного случайного кресла
    let rowsCount = await page.$$("div.buying-scheme__row");
    let rows = rowsCount.length; //авторасчет кол-ва рядов в зале
    let chairsInRowCount = await page.$$("div>span.buying-scheme__chair");
    let chairsInRow = chairsInRowCount.length / rows; //авторасчет кол-ва мест в одном ряду в зале
    let i,
      attempts = rows * chairsInRow * 3; // попытки найти свободное кресло: берем кол-во мест в зале, умноженное на 3
    for (i = 0; i < attempts; i++) {
      let row = Math.round(Math.random() * (rows - 1)) + 1;
      let chair = Math.round(Math.random() * (chairsInRow - 1)) + 1;
      let chairSelector =
        "div:nth-child(" + row + ") > span:nth-child(" + chair + ")";
      let className = await page.$eval(chairSelector, (el) => el.classList[2]);
      if (
        className !== "buying-scheme__chair_selected" &&
        className !== "buying-scheme__chair_taken"
      ) {
        return chairSelector;
      }
    }
    //Если цикл закончился, а свободного кресла не нашлось, то кидаем исключение
    throw new Error(
      `Сделано ${attempts} попыток - не удалось найти свободное кресло!`
    );
  },

  selectDate: async function (page, day) {
    // выбор дня недели вперед от текущей даты
    await page.waitForSelector("h1");
    let daysOfWeek = await page.$$("a.page-nav__day"); // выбрать дату - послезавтрашнее число
    await daysOfWeek[day].click();
  },

  selectHall: async function (page, index1) {
    // выбор зала
    let halls = await page.$$("div>ul>li");
    await halls[index1 - 1].click();
    await page.waitForSelector("p.buying__info-hall");
  },
};
