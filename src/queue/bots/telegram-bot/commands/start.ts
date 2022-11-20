import {
  LOGGER,
  IMPORT_MODULE,
  SERVER_BASE
} from '../../../..//configs/configs'

export default async (msg) => {

  const TELBOT = global['WORKER'].TELBOT._bot
  if (!TELBOT) {throw new Error("Bot não foi encontrado!")}

  const chatId = msg.chat.id;

  const helpMsg = "INSTIGARE MIDIA\n\n" +
    "/start" + "\n" +
    "/print [WPP/GEN]" + "\n\n" +
    "/alibot_login [MUSANI/PDA]" + "\n" +
    "/alibot_typecode [CÓDIGO]" + "\n" +
    "/alibot_logout" + "\n" +
    "/alibot_checklogin" + "\n"

  TELBOT.sendMessage(chatId, helpMsg);
}
