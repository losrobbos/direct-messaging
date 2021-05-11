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
  senderId: { type: Schema.Types.ObjectId, required: true },
  receiverId: { type: Schema.Types.ObjectId, required: true }
})

// find all people this user had a message exchange with
MessageSchema.statics.getContacts = function(userId) {
  const Message = this
  Message.find({
    $or: [ { senderId: userId, }, { receiverId: userId } ]
  })
}

// get history with another user
MessageSchema.statics.getContactHistory = function(senderId, receiverId) {
  const Message = this
  Message.find({
    $or: [ 
      { senderId: senderId, receiverId: receiverId }, 
      { senderId: receiverId, receiverId: senderId } 
    ]
  })
}

const Message = model("Message", MessageSchema)

module.exports = { User, Message }
