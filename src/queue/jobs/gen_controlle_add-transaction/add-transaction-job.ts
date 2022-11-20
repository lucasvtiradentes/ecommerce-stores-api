import {
  LOGGER,
  IMPORT_MODULE,
  DELAY
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import {waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function addTransactionJob(job) {

  const {type, category, description, value, date} = job.data

  const GENBOT = global.WORKER['GENBOT']
  const CONPAGE = global['CONPAGE']

  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }
  if (!CONPAGE) { return completeJob(false, "Página não encontrado!") }

  await CONPAGE.bringToFront()

  try {

    await openPage(CONPAGE)
    await openTransactionType(CONPAGE, type)
    await addDetails(CONPAGE, value, date, description)

    await addCategory(CONPAGE, category)
    await clickConfirmButton(CONPAGE)

    return completeJob(true, `${type} inserido no controlle`)

  } catch (error) {

    console.log(error)
    return completeJob(false, error.message)
  }

}



async function openPage(page) {
  const transactionsPageUrl = "https://app.controlle.com/1449876/a/lancamentos/todos"

  if (page.url() !== transactionsPageUrl) {
    await page.goto(transactionsPageUrl)
    await waitTillHTMLRendered(page)
  }

}

async function openTransactionType(page, type) {

  const sliderElement = await page.$('i.zze-round-button-red');
  const slider = await sliderElement.boundingBox();
  await page.mouse.move(slider.x + slider.width / 2, slider.y + slider.height / 2)
  await DELAY(3000)

  await page.evaluate((typeToPut) => {

    const costQuery = "ul.zze-popover-options > li.zze-item-read > a"
    const revenueQuery = "ul.zze-popover-options > li.zze-item-green > a"

    const finalQuery = typeToPut === "revenue" ? revenueQuery : costQuery
    const elTransaction: HTMLElement = document.querySelector(finalQuery)
    elTransaction?.click()

  }, type)

}

async function addDetails(page, value, date, description) {

  const deleteInputText = async (page) => {
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
  }

  await page.waitForSelector("#showDescription")
  await page.focus("#showDescription");
  await page.keyboard.type(description, { delay: 40 });

  await page.waitForSelector("#amountValue")
  await page.focus("#amountValue");
  await page.keyboard.type(value, { delay: 40 });

  await page.waitForSelector("#competence") // emissao
  await page.focus("#competence");
  await deleteInputText(page)
  await page.keyboard.type(date, { delay: 60 });

  await page.waitForSelector("#date") // vencimento
  await page.focus("#date");
  await deleteInputText(page)
  await page.keyboard.type(date, { delay: 60 });

  await DELAY(3000)

  await page.evaluate(() => {
    const elIsPaidButton: HTMLElement = document.querySelector('div.zze-datepicker > a.zze-component_hands-payment')
    elIsPaidButton?.click()
  })

  await DELAY(3000)

  await page.waitForSelector("#billing_date")
  await page.focus("#billing_date");
  await deleteInputText(page)
  await page.keyboard.type(date, { delay: 60 });

}

async function addCategory(page, category) {

  await page.evaluate(() => {
    const elCategory: HTMLElement = document.querySelector("#showCategories-selectized")
    elCategory.click()
  })

  const dataValue = await page.evaluate((categoryToPut) => {

    function selectDrop(itemToSelect) {

      const query = "div.selectize-dropdown-content > div.zze-truncate"
      const elements = document.querySelectorAll(query)

      for (let el of elements) {

        const curEl = el as HTMLElement
        const currentLabelEl: HTMLElement = curEl.querySelector('span.zze-selectize-label')
        const currentLabel = currentLabelEl.innerText

        if (itemToSelect === currentLabel) {
          curEl.click()
          const dataValue = el.getAttribute("data-value")
          return dataValue;
        }
      }

    }

    return selectDrop(categoryToPut)

  }, category)

  if (dataValue) {
    const categoryQuery = `div.selectize-dropdown-content > div[data-value="${dataValue}"]`
    const categoryItem = await page.$(categoryQuery);
    const categoryBox = await categoryItem.boundingBox();
    await page.mouse.move(categoryBox.x + categoryBox.width / 2, categoryBox.y + categoryBox.height / 2)
  }
}

async function clickConfirmButton(page){

  await page.evaluate(() => {
    const elConfirmButton: HTMLElement = document.querySelector('button[zze-loading="transaction.tracker.loadSave"] > i.icon-done-light')
    elConfirmButton.click()
  })

}
