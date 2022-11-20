import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import checkLoginAtAliexpress from './check-login-at-aliexpress'

export default async function checklogin() {

  const GENBOT = global.WORKER['GENBOT']
  if (!GENBOT) { return completeJob(false, "Cliente não está definido!") }

  try {
    const page = await GENBOT.newPage();
    const userLoggedIn = await checkLoginAtAliexpress(page)
    await page.close()

    if (userLoggedIn == false) {
      return completeJob(false, "NAO LOGADO")
    } else {
      return completeJob(true, userLoggedIn)
    }
  } catch (error) {
    return completeJob(false, error.message)
  }

}
