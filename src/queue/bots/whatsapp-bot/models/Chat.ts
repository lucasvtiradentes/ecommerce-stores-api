import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'key is missing'],
        unique: true,
    },
    chat: {
        type: Array,
    },
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
