import {
  LOGGER,
  IMPORT_MODULE,
  DELAY
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import {waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function restartJob(job) {

  const {applink} = job.data

  const GENBOT = global.WORKER['GENBOT']
  const GENPAGE = global['GENPAGE']

  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }
  if (!GENPAGE) { return completeJob(false, "Página não encontrado!") }

  await GENPAGE.bringToFront()

  try {

    await GENPAGE.goto(`${applink}/resources`)
    await waitTillHTMLRendered(GENPAGE)

    // INICIA ==================================================================
    const numberOfItens = await GENPAGE.evaluate(() => {
      const appsNodes = document.querySelectorAll('ul.list-group > li')
      if (appsNodes) {
        const appsArr = Array.from(appsNodes)
        return appsArr.length
      }
    })

    if (numberOfItens > 0) {
      for (let x = 0; x < numberOfItens; x++) {
        console.log(`${x + 1} / ${numberOfItens}`)

        const appRowInfo = await getAppRowInfo(GENPAGE, x)
        console.log(`\n\n### ${x} - ${appRowInfo.appType} - ${appRowInfo.appCommand} - ${appRowInfo.appStatus} ###################`)

        const clickEditButtonResult = await clickEditButton(GENPAGE, x)
        console.log(`EDIT: ${clickEditButtonResult}`)

        const clickSwitchButtonResult = await clickSwitchButton(GENPAGE, x)
        console.log(`SWITCH: ${clickSwitchButtonResult}`)
        await DELAY(5000)

        const clickConfirmButtonResult = await clickConfirmButton(GENPAGE, x)
        console.log(`CONFIRM: ${clickConfirmButtonResult}`)

        if (appRowInfo.appStatus === true){

          await DELAY(5000)

          const clickEditButtonResult = await clickEditButton(GENPAGE, x)
          console.log(`EDIT 2: ${clickEditButtonResult}`)

          const clickSwitchButtonResult = await clickSwitchButton(GENPAGE, x)
          console.log(`SWITCH 2: ${clickSwitchButtonResult}`)
          await DELAY(5000)

          const clickConfirmButtonResult = await clickConfirmButton(GENPAGE, x)
          console.log(`CONFIRM 2: ${clickConfirmButtonResult}`)

          await DELAY(5000)

        }
      }

    }

    // FINALIZA ================================================================
    await GENPAGE.goto(`https://dashboard.heroku.com/apps`)
    await waitTillHTMLRendered(GENPAGE)
    return completeJob(true, `Restartado!`)

  } catch (error) {
    return completeJob(false, error.message)
  }

}

async function getAppRowInfo(page, row){

  return await page.evaluate((curAppIndex) => {
    const appsNodes = document.querySelectorAll('ul.list-group > li')
    const appsArr = Array.from(appsNodes)
    let curAppEl = appsArr[curAppIndex]

    const appEl: HTMLElement = curAppEl.querySelector('span.name')
    const appType = appEl.innerText

    const appCommandEl: HTMLElement = curAppEl.querySelector('code.command')
    const appCommand = appCommandEl.innerText

    const appSwitchButton: HTMLInputElement = curAppEl.querySelector('div.toggle-switch > input')
    const appStatus = appSwitchButton ? appSwitchButton.checked : "#"

    return {
      appStatus,
      appType,
      appCommand
    }
  }, row)

}
async function clickEditButton(page, row){

  return await page.evaluate((curAppIndex) => {
    const appsNodes = document.querySelectorAll('ul.list-group > li')
    const appsArr = Array.from(appsNodes)
    let curAppEl = appsArr[curAppIndex]

    console.log(`1 - click edit button`)
    const appEditButton = curAppEl.querySelector('div.actions > button') as HTMLInputElement | null;

    if (appEditButton){
      appEditButton.click()
      return true
    } else {
      return false
    }

  }, row)
}

async function clickSwitchButton(page, row){
  return await page.evaluate((curAppIndex) => {
    const appsNodes = document.querySelectorAll('ul.list-group > li')
    const appsArr = Array.from(appsNodes)
    let curAppEl = appsArr[curAppIndex]

    console.log(`2 - click switch button`)
    const appSwitchButton = curAppEl.querySelector('div.toggle-switch > input') as HTMLInputElement | null;

    if (appSwitchButton){
      appSwitchButton.click()
      return true
    } else {
      return false
    }

  }, row)
}

async function clickConfirmButton(page, row){

  return await page.evaluate((curAppIndex) => {
    const appsNodes = document.querySelectorAll('ul.list-group > li')
    const appsArr = Array.from(appsNodes)
    let curAppEl = appsArr[curAppIndex]

    console.log(`3 - click confirm button`)

    const confirmButton = curAppEl.querySelectorAll('button')
    let setConfirmButton = false
    let isWaitedButton = false

    if (confirmButton.length > 0){
      const buttonsArr = Array.from(confirmButton)

      buttonsArr.map(but => {
        console.log(but)
        const hasClass = but.classList.contains('actions__confirm')
        if (hasClass){isWaitedButton = true}
      })
    }

    if (isWaitedButton){
      confirmButton[0].click()
      return true
    } else {
      return false
    }

  }, row)

}
