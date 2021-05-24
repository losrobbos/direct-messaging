# Socket.io

Find following a sample how to setup a simplified fullstack direct messaging app using React, Express, Socket.io & MongoDB.

For the Database setup create a .env file. Copy the .env.sample content into it and adapt the URL to your Mongo database.

Run `npm install`

Afterwards seed in some initial users + chat history: `npm run seed`

Now run `npm start`. 

Frontend and backend should start in parallel on the same terminal.

Start chatting :)


## Snippets


```
npm i socket.io-client // install Socket IO client for React
npm i socket.io // install socket io in Express
```

```
// FRONTEND setup
import socketIOClient from "socket.io-client";
const MESSAGE_SERVER_URL = "http://localhost:5000";

// connect on load...
useEffect(() => {
  // initialize connection - passing our userId
  const socket = socketIOClient(MESSAGE_SERVER_URL, { query: `userId:<MyDbUserId>` });
  // const socket = socketIo(MESSAGE_SERVER_URL, { transports: ['websocket'] }) 
    // this works even without CORS set in backend!

  socket.on("helloFromApi", data => {
    setResponse(data); // push response data into state
  });
}, []);
```

```
// BACKEND setup

const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const server = http.createServer(app);

  // hint: this will fail for React connections, because of CORS
const io = socketIo(server); // wrap HTTP server by socket => "extend API by socket routes"

  // configure for usage from other origin
const io = socketIo(server, {
  cors: { // configure CORS
    origin: "*" 
  }  
}) 

// listen for incoming chat clients...
socket.on('connection', (socket) => {

  // retrieve DB userID from connection...
  const userId = socket.handshake.query.userId

})


```
