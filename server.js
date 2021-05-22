const express = require("express")
const app = express() // create API
const socketIo = require("socket.io")
const cors = require("cors")
const logger = require("morgan")
require("./db-connect")
const { Message, User } = require("./models")

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log("API server started up", PORT))

app.use(cors())
app.use(express.json()) // parse incoming data into req.data
app.use(logger("dev"))

// get list of users
app.get("/users", async (req, res, next) => {
  res.json( await User.find() )
})

app.get("/chat-history/:meId/:otherId", async (req, res, next) => {
  const { meId, otherId } = req.params
  console.log(meId, otherId)
  // const history = await Message.find()
  const history = await Message.getContactHistory(meId, otherId)
  console.log({ history })
  res.json(history)
})

app.post("/login", async (req, res, next) => {
  // let userFound = users.find(user => user.name == req.body.name)
  let userFound = await User.findOne({ username: req.body.name })
  if(!userFound) {
    return res.status(400).json({ error: `User ${req.body.name} does not exist` })
  }
  res.json( userFound )
})

// wrap server with a socket server
const io = socketIo(server, {
  cors: { // configure CORS
    origin: "*"
  }
})


// listen to incoming clients...
io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId
  console.log("User ID connected: ", userId)

  socket.join(userId) // create "private room" - everyone can now send messages to this room by userId 

  // listen for incoming messages (= message hotline)
  socket.on("message", (data) => {
    const { senderId, receiverId, msg } = data // expect fields "msg" and "user"
    console.log("[EVENT] Message: ", data)

    // save message in history
    Message.create(data)

    // forward message to receiver
    io.to( receiverId ).emit('message', data); // send to other party
  })

})