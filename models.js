const mongoose = require("mongoose")
const { Schema, model } = mongoose

// USER SCHEMA
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  socketId: { type: String }
})

const User = model("User", UserSchema)

// MESSAGE HISTORY
const MessageSchema = new Schema({
  msg: { type: String, required: true },
  senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  receiverId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
})

// find all people this user had a message exchange with
MessageSchema.statics.getChatContacts = async function(userId) {
  const Message = this
  return Message.find({
    $or: [ { senderId: userId, }, { receiverId: userId } ]
  })
}

// get history with another user
MessageSchema.statics.getContactHistory = async function(user1, user2) {
  const Message = this
  return Message.find({
    $or: [
      { senderId: user1, receiverId: user2 }, 
      { senderId: user2, receiverId: user1 } 
    ]
  })
  .populate("senderId").populate("receiverId")
}

const Message = model("Message", MessageSchema)

module.exports = { User, Message }
