import {
  LOGGER,
  IMPORT_MODULE,
  TEL_BOT_TOKEN,
  DELAY
} from '../../..//configs/configs'

import TelegramBot from './components/TelegramBot'

export default async function initTelWorker() {

  try {

    LOGGER(`TEL BOT = INIT`, { from: 'QUEUE', pid: true })
    const curBot = new TelegramBot(TEL_BOT_TOKEN)

    if (await curBot.isPolling()) {
      LOGGER(`Definindo mensagens`, { from: 'QUEUE', pid: true })
      await curBot.setupMessages()
      return curBot
    }

  } catch (error) {

    LOGGER(`ERRO 3: ${error.message}`, { from: 'QUEUE', pid: true })

  } finally {

    LOGGER(`TEL BOT = DONE`, { from: 'QUEUE', pid: true })

  }

}
