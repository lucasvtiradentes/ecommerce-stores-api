import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import {addScriptAndRunIntoPage, waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function getOrderInfo(job) {

  const {orderid} = job.data

  const GENBOT = global.WORKER['GENBOT']
  const ALIPAGE = global['ALIPAGE']
  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  try {

    const page = await GENBOT.newPage();
    await page.goto(`https://trade.aliexpress.com/order_detail.htm?orderId=${orderid}`)
    await waitTillHTMLRendered(page)

    const orderProductCost = await addScriptAndRunIntoPage(page, getOrderPrice, "getOrderPrice()")

    // const orderAliexpressShippimentName = await addScriptAndRunIntoPage(page, getShippingName, "getShippingName()")
    // orderAliexpressShippimentName

    var orderObj = {
      orderProductCost
    }

    console.log(JSON.stringify(orderObj))

    await page.close()
    return completeJob(true, orderObj)

  } catch (error) {
    return completeJob(false, error.message)
  }


}

/* ################################################################################################################## */

function getOrderPrice(){

  try{
    const priceEl: NodeListOf<HTMLElement> = document.querySelectorAll('span.right-col')
    let priceValue = priceEl[1].innerText
    priceValue = priceValue.toString()
    priceValue = priceValue.split(" ")[1].trim();
    return priceValue
  }catch(e){
    return false
  }


}

/* ################################################################################################################## */
