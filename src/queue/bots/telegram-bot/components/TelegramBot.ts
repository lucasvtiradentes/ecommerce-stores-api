import { IMPORT_MODULE } from "../../../..//configs/configs";

import telegramBot from "node-telegram-bot-api";

import startCommand from '../commands/start'
import printCommand from '../commands/print'
import aliexpressLoginCommand from '../commands/alibot_login'
import aliexpressTypecodeCommand from '../commands/alibot_typecode'
import aliexpressCheckLoginCommand from '../commands/alibot_checklogin'
import aliexpressLogoutCommand from '../commands/alibot_logout'

export default class TelegramBot {

  public readonly _token: string
  public _bot: telegramBot

  constructor(token: string) {

    this._token = token
    this._bot = createnewBots(token)
  }

  async isPolling() {
    return this._bot.isPolling()
  }


  async closeBot() {
    if (this._bot !== undefined){
      await closePolling(this._bot)
      return await closeBot(this._bot)
    } else {
      console.log("bot ja tava undefined")
    }
  }

  async setupMessages() {

    this._bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(`${chatId} -> ${msg.text}`)
      this._bot.sendMessage(chatId, `Received your message from ${chatId}`);
    });

    await setBotCommands(this._bot)

  }

}

function createnewBots(token: string) {

  const newBot = new telegramBot(token, { polling: true });

  newBot.once("polling_error", async (err) => {
    console.log(err.message)
    await closePolling(newBot)
    console.log(`close result: ${closeBot(newBot)}`)
  });

  return newBot
}


async function closePolling(botInstance: telegramBot){

  try {
    console.log("Tentando finalizar polling")
    await botInstance.stopPolling()
    console.log("Polling foi finalizado")
    return true
  } catch (e) {
    console.log("Erro ao finalizar polling")
    console.log(e.message)
    return false
  }

}

async function closeBot(botInstance: telegramBot){

  try {
    console.log("Tentando fechar telegram bot")
    const closeResult = await botInstance.close()
    console.log("Telegram bot foi finalizado")
    return closeResult
  } catch (e) {
    console.log("Erro ao finalizar telegram bot")
    console.log(e.message)
    return false
  }

}

async function setBotCommands(botInstance){

  const generalCommands = [
    [/\/start/, startCommand],
    [/\/print (.+)/, printCommand]
  ]

  const aliCommands = [
    [/\/alibot_login (.+)/, aliexpressLoginCommand],
    [/\/alibot_typecode (.+)/, aliexpressTypecodeCommand],
    [/\/alibot_checklogin/, aliexpressCheckLoginCommand],
    [/\/alibot_logout/, aliexpressLogoutCommand],
  ]

  const allCommands = [
    ...generalCommands,
    ...aliCommands
  ]

  for (const curCommands of allCommands) {
    const [cmd, telFunction] = curCommands
    botInstance.onText(cmd, telFunction)
  }

}
