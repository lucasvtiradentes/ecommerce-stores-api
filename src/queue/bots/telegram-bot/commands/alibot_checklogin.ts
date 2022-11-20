import {
  LOGGER,
  IMPORT_MODULE,
  SERVER_BASE
} from '../../../..//configs/configs'

import fetchJsonUrl from '../../../..//utils/functions/fetch-json-url'

export default async (msg) => {

  const TELBOT = global['WORKER'].TELBOT._bot
  if (!TELBOT) {throw new Error("Bot não foi encontrado!")}

  const chatId = msg.chat.id;

  try{
    const urlCheckLogin = `${SERVER_BASE}/api/aliexpress/checklogin`
    console.log(urlCheckLogin)

    const checkObj = await fetchJsonUrl(urlCheckLogin)
    TELBOT.sendMessage(chatId, JSON.stringify(checkObj));
  }catch(e){
    TELBOT.sendMessage(chatId, "erro ao obter resposta");
  }

}
