import {
  LOGGER,
  IMPORT_MODULE,
  SERVER_BASE
} from '../../../..//configs/configs'

import fetchJsonUrl from '../../../..//utils/functions/fetch-json-url'

export default async (msg, match) => {

  const TELBOT = global['WORKER'].TELBOT._bot
  if (!TELBOT) {throw new Error("Bot não foi encontrado!")}

  const chatId = msg.chat.id;
  const code = match[1];
  const urlToVerificate = `${SERVER_BASE}/api/aliexpress/typecode?code=${code}`

  try{
    const verificateObj = await fetchJsonUrl(urlToVerificate)
    TELBOT.sendMessage(chatId, JSON.stringify(verificateObj));
  }catch(e){
    TELBOT.sendMessage(chatId, "Erro ao digitar código");
  }
}
