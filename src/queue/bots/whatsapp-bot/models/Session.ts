import { DATABASE_DATABASE_WPP } from '../../../..//configs/configs'

/* eslint-disable no-unsafe-optional-chaining */
import WhatsAppInstance from './WhatsAppInstance'
import P from 'pino'
const logger = P()

export default class Session {

  async restoreSessions(databaseObj) {

    let restoredSessions = new Array()
    let allCollections = []

    try {
      const db = databaseObj.db(DATABASE_DATABASE_WPP)
      const result = await db.listCollections().toArray()

      result.forEach((collection) => {
        if (collection.name !== "chats") {
          allCollections.push(collection.name)
        }
      })

      allCollections.map((key) => {
        const query = {}
        db.collection(key)
          .find(query)
          .toArray(async (err, result) => {
            if (err) throw err
            const instance = new WhatsAppInstance(key)
            await instance.init(databaseObj)
          })
        restoredSessions.push(key)
      })

    } catch (e) {
      logger.error('Error restoring sessions')
      logger.error(e)
    }

    return restoredSessions

  }

}

