import {
  LOGGER,
  TEL_IM_GROUP_CHATID,
  IMPORT_MODULE
} from '../../..//configs/configs'
import TelegramBot from '../../bots/telegram-bot/components/TelegramBot'

import completeJob from '../../components/completeJob'

export default async function imageInGroup(job) {

  const { image } = job.data

  const TELBOT: TelegramBot = global.WORKER['TELBOT']
  if (!TELBOT) { return completeJob(false, "Cliente não está definido!") }

  LOGGER(`TELIMAGE `, { from: 'QUEUE', pid: true })

  try {

    const fileOptionsObj = {
      caption: "browser!",
      filename: 'filename.png',
      contentType: 'image/jpeg'
    }

    await TELBOT._bot.sendPhoto(TEL_IM_GROUP_CHATID, image.data, fileOptionsObj)
    return completeJob(true, "imagem enviada")
  } catch (e) {
    LOGGER(e.message, { from: 'QUEUE', pid: true })

    return completeJob(false, "Erro ao mandar imagem")
  }
}
