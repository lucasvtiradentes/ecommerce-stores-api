import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import {waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function loginIntoAliexpress(page, username, password) {

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'pt-br,en-US;q=0.9,en;q=0.8' });
  await page.goto(`https://login.aliexpress.com/`, { waitUntil: ['networkidle2'] });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  await waitTillHTMLRendered(page)

  // TYPE CREDENTIALS ----------------------------------------------------------
  await page.waitForSelector("#fm-login-id")
  await page.focus("#fm-login-id");
  await page.keyboard.type(username, {delay: 40});

  await page.waitForSelector("#fm-login-password")
  await page.focus("#fm-login-password");
  await page.keyboard.type(password, {delay: 40});

  const elEnterLoginButtonQuery = 'button.login-submit'
  await page.waitForSelector(elEnterLoginButtonQuery)
  await page.evaluate((elementQuery) => {
    document.querySelector(elementQuery).click()
  }, elEnterLoginButtonQuery);

  // SLIDE TO LOGIN ------------------------------------------------------------
  try {

    await page.waitForSelector("#baxia-dialog-content", {timeout: 5000})
    await waitTillHTMLRendered(page)

    LOGGER("Carregou elemento de deslizar", { from: 'QUEUE', pid: true })

    const elementHandle = await page.$('#baxia-dialog-content');
    const frame = await elementHandle.contentFrame();

    const sliderElement = await frame.$('span.btn_slide');
    const slider = await sliderElement.boundingBox();

    const sliderContainerElement = await frame.$('span.nc-lang-cnt');
    const sliderContainer = await sliderContainerElement.boundingBox();

    await page.mouse.move(slider.x + slider.width / 2, slider.y + slider.height / 2)
    await page.mouse.down()
    await page.mouse.move(sliderContainer.x + sliderContainer.width, slider.y + slider.height / 2, { steps: 50 })
    await page.mouse.up()

    // await global.DELAY(8000)
    await waitTillHTMLRendered(page)
    LOGGER("espera navigation - pronto", { from: 'QUEUE', pid: true })

    return true;

  } catch (error) {

    if (error.message.search("#baxia-dialog-content") > 0) {
      LOGGER("Sem elemento de deslizar - true", { from: 'QUEUE', pid: true })
      return true;
    } else if (error.message === "Navigation timeout of 30000 ms exceeded") {
      LOGGER("Cabou 30s - false", { from: 'QUEUE', pid: true })
      return false;
    } else {
      LOGGER(error.message + " - false", { from: 'QUEUE', pid: true })
      return false;
    }
  }

}
