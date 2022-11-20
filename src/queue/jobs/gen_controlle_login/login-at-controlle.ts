import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import {waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function loginIntoControlle(page, username, password) {

  // await page.setExtraHTTPHeaders({ 'Accept-Language': 'pt-br,en-US;q=0.9,en;q=0.8' });
  await page.goto(`https://www.controlle.com/login/`);
  await waitTillHTMLRendered(page)

  // SLIDE TO LOGIN ------------------------------------------------------------
  try {

    // TYPE CREDENTIALS ----------------------------------------------------------
    await page.waitForSelector("#login-form-email")
    await page.focus("#login-form-email");
    await page.keyboard.type(username, { delay: 40 });

    await page.waitForSelector("#login-form-password")
    await page.focus("#login-form-password");
    await page.keyboard.type(password, { delay: 40 });

    await page.waitForSelector("#btn_submit_login")
    await page.evaluate((elementQuery) => {
      document.querySelector(elementQuery).click()
    }, "#btn_submit_login");

    return true;

  } catch (error) {

    LOGGER(error.message + " - false", { from: 'QUEUE', pid: true })
    return false;

  }

}
