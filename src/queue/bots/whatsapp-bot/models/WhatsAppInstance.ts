import {
  DATABASE_DATABASE_WPP,
  DATABASE_DATABASE_GENERAL,
  DATABASE_COLLECTION_VARIABLES,
  WPP_IM_GROUP_CHATID
} from '../../../..//configs/configs'

import makeWASocket, { DisconnectReason } from '@adiwajshing/baileys'
import QRCode from 'qrcode'
import P from 'pino'
import { v4 as uuidv4 } from 'uuid'

import Chat from './Chat'
import useMongoDBAuthState from '../components/mongoAuthState'
import processButton from '../components/processbtn'
import { deleteObjInCollection, AddObjToCollection, findObjInCollection, updateObjInCollection } from '../../../..//utils/libraries/mongodb'

const logger = P()
const browser = {
  platform: 'Whatsapp MD',
  browser: 'Chrome',
  version: '4.0.0'
}

export default class WhatsAppInstance {

  public socketConfig: any = {
    printQRInTerminal: false,
    logger: P({ level: "silent" })
  }
  public key: string = ''
  public authState: any
  public instance: any = {
    key: this.key,
    chats: [],
    qr: '',
    messages: [],
    qrRetry: 0,
  }
  public collection: any

  constructor(key?) {
    this.key = key ? key : uuidv4()
  }

  async init(databaseObj) {

    this.collection = databaseObj.db(DATABASE_DATABASE_WPP).collection(this.key)
    const { state, saveCreds } = await useMongoDBAuthState(this.collection)
    this.authState = { state: state, saveCreds: saveCreds }
    this.socketConfig.auth = this.authState.state
    this.socketConfig.browser = Object.values(browser)
    this.instance.sock = makeWASocket(this.socketConfig)
    this.setHandler(databaseObj)
    return this
  }

  setHandler(database) {
    const sock = this.instance.sock

    // on credentials update save state
    sock?.ev.on('creds.update', this.authState.saveCreds)

    // on socket closed, opened, connecting
    sock?.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (connection === 'connecting') return

      if (connection === 'close') {

        global.WORKER['WPPBOT'] = undefined
        console.log("FECHOU CONEXAO")

        // reconnect if not logged out
        if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
          await this.init(database)
        } else {
          await this.collection.drop().then((r) => { logger.info('STATE: Droped collection') })
          this.instance.online = false
        }
      } else if (connection === 'open') {

        global.WORKER['WPPBOT'] = this
        console.log("CONECTOU")

        let alreadyThere = await Chat.findOne({ key: this.key }).exec()
        if (!alreadyThere) {
          const saveChat = new Chat({ key: this.key })
          await saveChat.save()
        }

        const findResult = await findObjInCollection(database, DATABASE_DATABASE_GENERAL, DATABASE_COLLECTION_VARIABLES, { objName: 'QR_CODE' })
        if (findResult) {
          await deleteObjInCollection(database, DATABASE_DATABASE_GENERAL, DATABASE_COLLECTION_VARIABLES, { _id: findResult[0]._id })
          console.log('QRCODE APAGADO PORQUE LOGOU')
        }

        this.instance.online = true

      }

      if (qr) {


        QRCode.toDataURL(qr).then(async (url) => {

          this.instance.qr = url
          this.instance.qrRetry++
          console.log(`\n\nNOVO QR GERADO: ${this.instance.qrRetry}`)

          if (this.instance.qrRetry >= 3) {

            this.instance.sock.ws.close()
            this.instance.sock.ev.removeAllListeners()
            this.instance.qr = ' '
            logger.info('socket connection terminated')

          } else {

            const findResult = await findObjInCollection(database, DATABASE_DATABASE_GENERAL, DATABASE_COLLECTION_VARIABLES, { objName: 'QR_CODE' })
            if (!findResult) {
              await AddObjToCollection(database, DATABASE_DATABASE_GENERAL, DATABASE_COLLECTION_VARIABLES, { objName: 'QR_CODE', urlImage: url }, true)
              console.log('QRCODE ADICIONADO AO BD')
            } else {
              await updateObjInCollection(database, DATABASE_DATABASE_GENERAL, DATABASE_COLLECTION_VARIABLES, { _id: findResult[0]._id }, { objName: 'QR_CODE', urlImage: url })
              console.log('QRCODE ATUALIZADO NO BD')
            }

          }
        })
      }
    })

    // on receive all chats
    sock?.ev.on('chats.set', async ({ chats }) => {
      console.log("PEGOU TODAS AS CONVERSAS")
      const recivedChats = chats.map((chat) => {
        return {
          ...chat,
          messages: []
        }
      })
      this.instance.chats.push(...recivedChats)
      await this.updateDb(this.instance.chats)
    })

    // on recive new chat
    sock?.ev.on('chats.upsert', (newChat) => {
      console.log("PEGOU NOVA CONVERSA")
      const chats = newChat.map((chat) => {
        return {
          ...chat,
          messages: [],
        }
      })

      this.instance.chats.push(...chats)
    })

    // on chat change
    sock?.ev.on('chats.update', (changedChat) => {
      console.log("CHAT CHANGE")
      changedChat.map((chat) => {
        const index = this.instance.chats.findIndex((pc) => pc.id === chat.id)
        const PrevChat = this.instance.chats[index]
        this.instance.chats[index] = {
          ...PrevChat,
          ...chat,
        }
      })
    })

    // on chat delete
    sock?.ev.on('chats.delete', (deletedChats) => {
      console.log("CHAT DELETE")
      deletedChats.map((chat) => {
        const index = this.instance.chats.findIndex((c) => c.id === chat)
        this.instance.chats.splice(index, 1)
      })
    })

    // on new mssage
    sock?.ev.on('messages.upsert', (m) => {
      console.log("MENSAGEM NOVA")
      if (m.type === 'prepend') { this.instance.messages.unshift(...m.messages) }
      if (m.type !== 'notify') { return }

      this.instance.messages.unshift(...m.messages)

      for (let x = 0; x < m.messages.length; x++) {
        const msg = m.messages[x]

        if (!msg.message) return
        if (msg.key.fromMe) return

        const messageType = Object.keys(msg.message)[0]
        if (['protocolMessage', 'senderKeyDistributionMessage'].includes(messageType)) { return }

      }

    })

    sock?.ev.on('messages.update', async (messages) => {
     console.log("MENSAGEM NOVA 2")
     for (const message of messages) {
       const is_delivered = message?.update?.status === 3;
       const is_seen = message?.update?.status === 4
     }
    })

    sock?.ws.on('CB:call', async (data) => {
      console.log("CALL NOVA")
      if (data.content) {
        if (data.content.find(e => e.tag === 'offer')) {
          const content = data.content.find(e => e.tag === 'offer')

          // await this.SendWebhook('call_offer', {
          //   id: content.attrs['call-id'],
          //   timestamp: parseInt(data.attrs.t),
          //   user: {
          //     id: data.attrs.from,
          //     platform: data.attrs.platform,
          //     platform_version: data.attrs.version
          //   }
          // })
        } else if (data.content.find(e => e.tag === 'terminate')) {
          const content = data.content.find(e => e.tag === 'terminate')

          // await this.SendWebhook('call_terminate', {
          //   id: content.attrs['call-id'],
          //   user: {
          //     id: data.attrs.from
          //   },
          //   timestamp: parseInt(data.attrs.t),
          //   reason: data.content[0].attrs.reason
          // })
        }
      }
    })

    sock?.ev.on('groups.upsert', async (newChat) => {
      console.log("GROUP UPSERT")
      //console.log(newChat)
      this.createGroupByApp(newChat)
    })

    sock?.ev.on('groups.update', async (newChat) => {
      console.log("GROUP UPDATE")
      //console.log(newChat)
      this.updateGroupByApp(newChat)
    })

  }

  async getInstanceDetail(key) {
    return {
      instance_key: key,
      phone_connected: this.instance?.online,
      user: this.instance?.online ? this.instance.sock?.user : {},
    }
  }

  getWhatsAppId(id) {
    if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
    return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
  }

  async verifyId(id) {
    if (id.includes('@g.us')) return true
    const [result] = await this.instance.sock?.onWhatsApp(id)
    if (result?.exists) return true
    throw new Error('no account exists')
  }

  async sendTextMessage(to, message) {
    await this.verifyId(this.getWhatsAppId(to))
    const data = await this.instance.sock?.sendMessage(this.getWhatsAppId(to), { text: message })
    return data
  }

  async sendMediaFile(to, file, type, caption = '', filename) {
    await this.verifyId(this.getWhatsAppId(to))
    const data = await this.instance.sock?.sendMessage(
      this.getWhatsAppId(to),
      {
        mimetype: file.mimetype,
        [type]: file.buffer,
        caption: caption,
        ptt: type === 'audio' ? true : false,
        fileName: filename ? filename : file.originalname,
      }
    )
    return data
  }

  async sendButtonMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))
    const result = await this.instance.sock?.sendMessage(
      this.getWhatsAppId(to),
      {
        templateButtons: processButton(data.buttons),
        text: data.text ?? '',
        footer: data.footerText ?? '',
      }
    )
    return result
  }

  async sendListMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))
    const result = await this.instance.sock?.sendMessage(
      this.getWhatsAppId(to),
      {
        text: data.text,
        sections: data.sections,
        buttonText: data.buttonText,
        footer: data.description,
        title: data.title,
      }
    )
    return result
  }

  async sendMediaButtonMessage(to, data) {
    await this.verifyId(this.getWhatsAppId(to))

    const result = await this.instance.sock?.sendMessage(
      this.getWhatsAppId(to),
      {
        [data.mediaType]: {
          url: data.image,
        },
        footer: data.footerText ?? '',
        caption: data.text,
        templateButtons: processButton(data.buttons),
        mimetype: data.mimeType,
      }
    )
    return result
  }

  async sendUrlMediaFile(to, url, type, mimeType, caption = '') {
    await this.verifyId(this.getWhatsAppId(to))

    const data = await this.instance.sock?.sendMessage(
      this.getWhatsAppId(to),
      {
        [type]: {
          url: url,
        },
        caption: caption,
        mimetype: mimeType,
      }
    )
    return data
  }

  async DownloadProfile(of) {
    await this.verifyId(this.getWhatsAppId(of))
    const ppUrl = await this.instance.sock?.profilePictureUrl(
      this.getWhatsAppId(of),
      'image'
    )
    return ppUrl
  }

  async getUserStatus(of) {
    await this.verifyId(this.getWhatsAppId(of))
    const status = await this.instance.sock?.fetchStatus(
      this.getWhatsAppId(of)
    )
    return status
  }

  async setStatus(status, to) {
    await this.verifyId(this.getWhatsAppId(to))

    const result = await this.instance.sock?.sendPresenceUpdate(status, to)
    return result
  }

  // get Chat object from db
  async getChat(key = this.key) {
    let dbResult = await Chat.findOne({ key: key }).exec()
    let ChatObj = dbResult.chat
    return ChatObj
  }

  // update db document -> chat
  async updateDb(object) {
    try {
      await Chat.updateOne({ key: this.key }, { chat: object })
    } catch (e) {
      logger.error('Error updating document failed')
    }
  }

  async groupFetchAllParticipating() {
    const result = await this.instance.sock?.groupFetchAllParticipating()
    return result
  }

  // create new group by application
  async createGroupByApp(newChat) {
    let Chats = await this.getChat()
    let group = {
      id: newChat[0].id,
      name: newChat[0].subject,
      participant: newChat[0].participants,
      messages: []
    }
    Chats.push(group)
    try {
      await this.updateDb(Chats)
    } catch (e) {
      logger.error('Error updating document failed')
    }
  }

  async updateGroupByApp(newChat) {
    let Chats = await this.getChat()
    Chats.find((c) => c.id === newChat[0].id).name = newChat[0].subject
    try {
        await this.updateDb(Chats)
    } catch (e) {
        logger.error('Error updating document failed')
    }
  }

}

