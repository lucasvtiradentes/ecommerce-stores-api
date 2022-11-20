import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import {addScriptAndRunIntoPage, waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function (page) {


  LOGGER("Checando login no aliexpress", { from: 'QUEUE', pid: true })
  await page.goto("https://trade.aliexpress.com/orderList.htm");

  await waitTillHTMLRendered(page)

  var aliUserName = await addScriptAndRunIntoPage(page, getAliUserName, "getAliUserName()")

  if (aliUserName.toString().length > 0) {
    LOGGER("-> logged in as = " + aliUserName, { from: 'QUEUE', pid: true })
    return aliUserName
  } else {
    LOGGER("Couldnt login!", { from: 'QUEUE', pid: true })
    return false
  }

}

function getAliUserName(){

  let userName = document.querySelector("span.account-name") as HTMLElement | null
  if (!userName){return ""}

  let finalName = userName.textContent.toString()
  finalName = finalName.replace("Olá, ", "")
  finalName = finalName.replace("Hi, ", "")

  return finalName;
}
