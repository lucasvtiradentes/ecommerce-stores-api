import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import {addScriptAndRunIntoPage, waitTillHTMLRendered} from '../../..//utils/libraries/puppeteer'

export default async function logoutJob() {

  const GENBOT = global.WORKER['GENBOT']
  const ALIPAGE = global['ALIPAGE']

  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  await ALIPAGE.bringToFront()

  try {
    await addScriptAndRunIntoPage(ALIPAGE, clickLogout, "clickLogout()")
    return completeJob(true, "Logout concluído!")
  } catch (error) {
    return completeJob(false, error.message)
  }

}

function clickLogout() {
  const elLogout = document.querySelector('p.flyout-sign-out > a') as HTMLElement | null;
  if (elLogout) {
    elLogout.click()
  }
}
