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
  const urlToLogout = `${SERVER_BASE}/api/aliexpress/logout`

  try{
    const logoutObj = await fetchJsonUrl(urlToLogout)
    TELBOT.sendMessage(chatId, JSON.stringify(logoutObj));
  }catch(e){
    TELBOT.sendMessage(chatId, "Erro ao fazer logout");
  }
}
