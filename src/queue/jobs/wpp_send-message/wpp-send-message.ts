import {
  LOGGER,
  IMPORT_MODULE
} from '../../..//configs/configs'

import completeJob from '../../components/completeJob'
import WhatsAppInstance from '../../bots/whatsapp-bot/models/WhatsAppInstance'

export default async function sendMessageToChat(job) {

  const {chatId, message} = job.data

  LOGGER("JOB = Mandando mensagem no whatsapp!", { from: 'QUEUE', pid: true })

  const WPPBOT: WhatsAppInstance = global.WORKER['WPPBOT']
  if (!WPPBOT) { return completeJob(false, "Cliente não está definido!") }

  try {

    try{
      await WPPBOT.sendTextMessage(chatId, message)
      return completeJob(true, "Mensagem foi enviada com sucesso")
    }catch(e){
      return completeJob(false, "Erro ao mandar mensagem")
    }

  } catch (error) {
    return completeJob(false, error.message)
  }

}
