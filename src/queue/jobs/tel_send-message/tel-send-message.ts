import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'
import TelegramBot from '../../bots/telegram-bot/components/TelegramBot'

import completeJob from '../../components/completeJob'

export default async function telegramMessage(job) {

  const {chatid, message} = job.data

  const TELBOT: TelegramBot = global.WORKER['TELBOT']
  if (!TELBOT) { return completeJob(false, "Cliente não está definido!") }

  LOGGER(`TELEGRAM MESSAGE -> ${chatid} | ${message}`, { from: 'WORKER', pid: true })

  try{
    await TELBOT._bot.sendMessage(chatid, message);
    return completeJob(true, "Mensagem enviada")
  }catch(e){
    await TELBOT._bot.sendMessage(chatid, "Erro ao mandar mensagem");
    return completeJob(false, "Erro ao mandar mensagem")
  }

}

