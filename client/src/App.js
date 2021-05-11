import './App.css';
import io from 'socket.io-client'
import { useEffect, useRef, useState } from 'react';
import faker from 'faker'

const MESSAGE_SERVER_URL = "http://localhost:5000/"

function App() {

  const [socket, setSocket] = useState()
  const [user, setUser] = useState({ 
    _id:  faker.random.alphaNumeric(10), 
    name: faker.name.firstName()
  })

  const [chatHistory, setChatHistory] = useState([
    { text: "Hey there", user: "Rob", },
    { text: "Hi Rob", user: "Raquel" },
  ])

  const msgRef = useRef() // store fresh message
  const userToId = useRef()

  // initialize connection on load
  useEffect(() => {
    // set user ID on connection!
    // other parties can then send messages directly to our userId!
    const socket = io(MESSAGE_SERVER_URL, { query: `userId=${user._id}` }) // connect to API
    setSocket(socket)

    // Disconnect to socket on leave...
    return () => socket && socket.disconnect()

  }, [])
  

  // define listeners AFTER connection is setup
  useEffect(() => {

    if(socket) {
      console.log("Registering chat message listener...")
      socket.on("message", (chatMsg) => {
        console.log("Received message from server: ", chatMsg)
        setChatHistory([...chatHistory, chatMsg])
      })
    }

    return () => {
      if(socket) socket.off('message')
    }

  }, [socket, chatHistory]) // this effect will FIRE when the socket was set!

  const addChatMessageToHistory = (e) => {
    e.preventDefault()

    if(!msgRef.current.value || !userToId.current.value) {
      alert("Please state a message + receiver")
      return
    }

    let chatMsg = { text: msgRef.current.value, user: user.name, receiverId: userToId.current.value }
    msgRef.current.value = "" // clear input box
    userToId.current.value = "" // clear ID box

    socket.emit('message', chatMsg) // send an EVENT to server! (to a hotline channel)
    setChatHistory([ ...chatHistory, chatMsg ])    
  }
 
  // create JSX list from chat history entries
  let jsxChatHistory = chatHistory.map((chatMsg, i) => (
    <div className="chat-msg" key={i}>
      <label>{chatMsg.user}:</label>
      <span>{chatMsg.text}</span>
    </div>
  ))

  return (
    <div className="App">
      <header className="App-header">
        <h2>Chat</h2>
        <div>My ID: {user._id}</div>
        <div id="chat-area">{jsxChatHistory}</div>
        <form id="message-send" onSubmit={addChatMessageToHistory}>
          <input 
            autoComplete="off"
            ref={msgRef}
            placeholder={`Type your message, ${user.name}...`} />
          <input 
            autoComplete="off"
            ref={userToId}
            placeholder={`<ReceiverID>`} />
          <button type="submit" >Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
