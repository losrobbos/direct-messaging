const mongoose = require('mongoose')

const strConn =  process.env.MONGO_URI || "mongodb://localhost/chat_direct_db"
mongoose.connect(strConn, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log("Connection to cloud database established!"))
.catch((err) => console.log("[ERROR] Conn failed..."))