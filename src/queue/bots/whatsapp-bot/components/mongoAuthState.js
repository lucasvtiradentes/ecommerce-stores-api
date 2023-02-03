const { proto } = require('@adiwajshing/baileys/WAProto')
const { Curve, signedKeyPair } = require('@adiwajshing/baileys/lib/Utils/crypto')
const { generateRegistrationId } = require('@adiwajshing/baileys/lib/Utils/generics')
const { randomBytes } = require('crypto')

const initAuthCreds = () => {
    const identityKey = Curve.generateKeyPair()
    return {
        noiseKey: Curve.generateKeyPair(),
        signedIdentityKey: identityKey,
        signedPreKey: signedKeyPair(identityKey, 1),
        registrationId: generateRegistrationId(),
        advSecretKey: randomBytes(32).toString('base64'),
        processedHistoryMessages: [],
        nextPreKeyId: 1,
        firstUnuploadedPreKeyId: 1,
        accountSettings: {
            unarchiveChats: false,
        },
    }
}

const BufferJSON = {
    replacer: (k, value) => {
        if (
            Buffer.isBuffer(value) ||
            value instanceof Uint8Array ||
            value?.type === 'Buffer'
        ) {
            return {
                type: 'Buffer',
                data: Buffer.from(value?.data || value).toString('base64'),
            }
        }

        return value
    },

    reviver: (_, value) => {
        if (
            typeof value === 'object' &&
            !!value &&
            (value.buffer === true || value.type === 'Buffer')
        ) {
            const val = value.data || value.value
            return typeof val === 'string'
                ? Buffer.from(val, 'base64')
                : Buffer.from(val || [])
        }

        return value
    },
}

export default async function useMongoDBAuthState(collection){
    const writeData = (data, id) => {
        return collection.replaceOne(
            { _id: id },
            JSON.parse(JSON.stringify(data, BufferJSON.replacer)),
            { upsert: true }
        )
    }
    const readData = async (id) => {
        try {
            const data = JSON.stringify(await collection.findOne({ _id: id }))
            return JSON.parse(data, BufferJSON.reviver)
        } catch (error) {
            return null
        }
    }
    const removeData = async (id) => {
        try {
            await collection.deleteOne({ _id: id })
        } catch (_a) {
            console.log(`nao achou o ${_a}`)
        }
    }
    const creds = (await readData('creds')) || (0, initAuthCreds)()
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {}
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`)
                            if (type === 'app-state-sync-key') {
                                value =
                                    proto.AppStateSyncKeyData.fromObject(data)
                            }
                            data[id] = value
                        })
                    )
                    return data
                },
                set: async (data) => {
                    const tasks = []
                    for (const category of Object.keys(data)) {
                        for (const id of Object.keys(data[category])) {
                            const value = data[category][id]
                            const key = `${category}-${id}`
                            tasks.push(
                                value ? writeData(value, key) : removeData(key)
                            )
                        }
                    }
                    await Promise.all(tasks)
                },
            },
        },
        saveCreds: () => {

            console.log("SALVANDO CREDENCIAIS")
            return writeData(creds, 'creds')
        },
    }
}
