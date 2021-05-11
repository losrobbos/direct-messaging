const express = require("express")
const app = express() // create API
const socketIo = require("socket.io")
const { Message, User } = require("./models")

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log("API server started up", PORT))

// wrap server with a socket server
const io = socketIo(server, {
  cors: { // configure CORS
    origin: "*" 
  }  
})


// listen to incoming clients...
io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId

  console.log("Someone connected...", socket.id)
  console.log("User ID: ", userId)

  socket.join(userId)

  // listen for incoming messages (= message hotline)
  socket.on("message", (data) => {
    const { receiverId } = data // expect fields "msg" and "user"
    console.log(data, typeof(data))

    // TODO: store message in message history
    io.to( data.receiverId ).emit('message', data); // send to other party
    // socket.broadcast.emit("message", data)
  })

  // socket.on('disconnect', () => {
  //   console.log('Client disconnected');
  //   // onDisconnect();
  // });
  
})