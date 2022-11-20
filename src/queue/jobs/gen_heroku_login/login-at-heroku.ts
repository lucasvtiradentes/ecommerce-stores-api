import {
  LOGGER,
  IMPORT_MODULE,
  DELAY
} from '../../..//configs/configs'

import {waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function loginIntoHeroku(page, username, password) {

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'pt-br,en-US;q=0.9,en;q=0.8' });
  await page.goto(`https://id.heroku.com/login`, { waitUntil: ['networkidle2'] });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  await waitTillHTMLRendered(page)

  // SLIDE TO LOGIN ------------------------------------------------------------
  try {

    await DELAY(2000)

    // await page.waitForSelector("#onetrust-accept-btn-handler")
    await page.evaluate(() => {
      const acceptButton = document.getElementById("onetrust-accept-btn-handler")
      if (acceptButton){
        acceptButton.click()
      }
    });

    await DELAY(2000)

    await page.waitForSelector("#email")
    await page.focus("#email");
    await page.keyboard.type(username, { delay: 40 });

    await page.waitForSelector("#password")
    await page.focus("#password");
    await page.keyboard.type(password, { delay: 40 });

    await page.waitForSelector('button[value="Log In"]')
    await page.evaluate((elementQuery) => {
      const elClick = document.querySelector(elementQuery)
      if (elClick){
        elClick.click()
      }
    }, 'button[value="Log In"]');

    await DELAY(4000)

    await page.evaluate(() => {
      const conty = document.getElementById("mfa-later")
      const divs = conty.querySelectorAll("button")
      divs[0].click()
    });

    await DELAY(4000)
    await waitTillHTMLRendered(page)

    const loginName = await page.evaluate(() => {
      const elName: HTMLElement = document.querySelector('div.glostick__account-details__name')
      if (elName){
        return elName.innerText
      } else {
        return "Não logou!"
      }
    });

    LOGGER("HEROKU USER: " + loginName, { from: 'QUEUE', pid: true })
    return true;

  } catch (error) {
    LOGGER(error.message + " - false", { from: 'QUEUE', pid: true })
    return false;

  }

}
