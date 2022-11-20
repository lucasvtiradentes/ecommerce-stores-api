import {
  LOGGER,
  IMPORT_MODULE,
  DELAY,
  GET_BOT_INFO
} from '../../..//configs/configs'

import createBrowserClient from './components/create-browser-client'

import loginAtControlleDirect from '../../jobs/gen_controlle_login/login-at-controlle'
import loginAtAliexpressDirect from '../../jobs/gen_aliexpress_login/login-at-aliexpress'
import loginAtHerokuDirect from '../../jobs/gen_heroku_login/login-at-heroku'


export default async function initGenWorker() {

  const genBotConfigs = GET_BOT_INFO('GEN BOT').options
  LOGGER(`GENERAL = INIT`, { from: 'QUEUE', pid: true })

  try {
    const browser = await createBrowserClient()

    if (genBotConfigs.heroku_bot === true){
      global.GENPAGE = (await browser.pages())[0];
      await loginAtHerokuDirect(global.GENPAGE, "contato@instigaremidia.com", "Insti1010!")
      await DELAY(3000)
    }

    if (genBotConfigs.controlle_bot === true){
      global.CONPAGE = await browser.newPage()
      await loginAtControlleDirect(global.CONPAGE, "contato@instigaremidia.com", "Insti1010!")
      await DELAY(3000)
    }

    if (genBotConfigs.aliexpress_bot === true){
      global.ALIPAGE = await browser.newPage()
      await loginAtAliexpressDirect(global.ALIPAGE, "im.produtosdoamanha@gmail.com", "Insti1010!")
    }

    LOGGER(`GENERAL = DONE`, { from: 'QUEUE', pid: true })
    return browser;
  } catch (error) {
    console.log(error.message)
    return false
  }

}
