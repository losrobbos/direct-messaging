const mongoose = require('mongoose')
const { User, Message } = require("./models")

require("./db-connect")

// Seed in some data
const seed = async () => {
  
  await Message.deleteMany()
  await User.deleteMany()

  const users = await User.insertMany([
    { username: "aghyzard" }, 
    { username: "vasilipauf" },
    { username: "robosaur" }
  ])

  const msgs = await Message.insertMany([
    // exchange 1
    {
      senderId: users[0],
      receiverId: users[1],
      msg: "hey"
    },
    {
      senderId: users[0],
      receiverId: users[1],
      msg: "all good??"
    },
    {
      senderId: users[1],
      receiverId: users[0],
      msg: "heyyy back"
    },
    {
      senderId: users[1],
      receiverId: users[0],
      msg: "yes, it's good"
    },
    {
      senderId: users[0],
      receiverId: users[1],
      msg: "goody goody to hear"
    },

    // exchange 2
    {
      senderId: users[0],
      receiverId: users[2],
      msg: "good morning, robo"
    },
    {
      senderId: users[2],
      receiverId: users[0],
      msg: "good morning, aghy"
    }
  ])

  mongoose.connection.close()
  console.log("Seeding finished!")
  console.log(`Seeded: ${users.length} users & ${msgs.length} messages`)

}
seed()
