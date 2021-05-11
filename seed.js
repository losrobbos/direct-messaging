const mongoose = require('mongoose')
const { User, Message } = require("./models")

const strConn = "mongodb://localhost/chat_direct_db"
mongoose.connect(strConn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log("Connection to database established!"))
.catch((err) => console.log("[ERROR] Connection failed!"))

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

}
seed()
