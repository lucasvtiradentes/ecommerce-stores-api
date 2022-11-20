import {
  LOGGER,
  IMPORT_MODULE,
  SERVER_BASE,
} from '../../../..//configs/configs'

import fetchJsonUrl from '../../../..//utils/functions/fetch-json-url'

export default async (msg, match) => {

  const TELBOT = global['WORKER'].TELBOT._bot
  if (!TELBOT) {throw new Error("Bot não foi encontrado!")}

  const chatId = msg.chat.id;
  const store = match[1];

  let username;
  let password;

  if (store === "PDA") {
    username = "contato@produtosdoamanha.com.br"
    password = "Insti1010!"
  } else if (store === "MUSANI") {
    username = "contato@musani.com.br"
    password = "Insti1010!"
  }

  try{
    const urlToLogin = `${SERVER_BASE}/api/aliexpress/login?username=${username}&password=${password}`
    console.log(urlToLogin)

    const loginObj = await fetchJsonUrl(urlToLogin)
    TELBOT.sendMessage(chatId, JSON.stringify(loginObj));
  }catch(e){
    TELBOT.sendMessage(chatId, "Erro ao fazer login");
  }
}
