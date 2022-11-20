import {
  IMPORT_MODULE,
  DELAY,
  LOGGER
} from '../../..//configs/configs'

import WhatsappInstance from './models/WhatsAppInstance'
import Session from './models/Session'

export default async function initWppClient(databaseObj){

  LOGGER(`WPP BOT = INIT`, { from: 'WORKER', pid: true })

  const session = new Session()
  const restoredSessions = await session.restoreSessions(databaseObj)

  if (restoredSessions.length === 0){
    LOGGER("CRIANDO NOVO BOT PQ N TEM", { from: 'WORKER', pid: true })
    let wppBot = new WhatsappInstance()
    await wppBot.init(databaseObj)
    return wppBot
  } else {
    LOGGER(`Foram restauradas ${restoredSessions.length} sessões`, { from: 'WORKER', pid: true })
    return global.WORKER['WPPBOT']
  }

}
