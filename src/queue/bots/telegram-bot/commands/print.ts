import {
  LOGGER,
  IMPORT_MODULE,
  SERVER_BASE
} from '../../../..//configs/configs'

export default async (msg, match) => {

  const TELBOT = global['WORKER'].TELBOT._bot
  if (!TELBOT) {throw new Error("Bot não foi encontrado!")}

  const chatId = msg.chat.id;
  const browserToPrint = match[1];

  let browser;
  if (browserToPrint === "GEN"){
    browser = global.GENBOT
  } else if (browserToPrint === "WPP"){
    browser = (global.WPPBOT).pupBrowser
  } else {
    console.log(`Opção inválida!`)
    return;
  }

  if (!browser) {
    console.log(`Nao encontrou o browser`)
    return;
  }

  try{
    const page = (await browser.pages())[0]
    const photo = await page.screenshot().then((buffer) => buffer);

    const fileOptionsObj = {
      caption: "browser!",
      filename: 'filename.png',
      contentType: 'image/jpeg'
    }

    TELBOT.sendPhoto(chatId, photo, fileOptionsObj).then(() => {
      console.log(`Tirou print do alibot!`)
    });
  }catch(e){
    TELBOT.sendMessage(chatId, "Erro ao mandar print");
  }

}
