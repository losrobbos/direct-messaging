import { useEffect, useRef, useState } from "react"

const ChatHistory = ({ user, contact, socket, chatHistory, setChatHistory }) => {

  const msgRef = useRef() // store fresh message

  // define listeners AFTER connection is setup
  useEffect(() => {

    if(!socket) {
      return 
    }

    socket.on("message", (chatMsg) => {
      console.log("Received message from server: ", chatMsg)

      // ONLY add messages to histoy by allowed contact user...
      if(chatMsg.senderId != contact._id) {
        console.log("Message discarded... non active room user")
        return
      }

      setChatHistory([...chatHistory, chatMsg])
    })

    return () => socket && socket.off('message') // unregister message event listeing...

  }, [socket, chatHistory]) // this effect will FIRE when the socket was set!


  const addChatMessageToHistory = (e) => {
    e.preventDefault()

    if(!msgRef.current.value) return alert("Please state a message")

    let chatMsg = { 
      text: msgRef.current.value, 
      user: user.name, 
      senderId: user._id,
      receiverId: contact._id }
    msgRef.current.value = "" // clear input box

    socket.emit('message', chatMsg) // send an EVENT to server! (to a hotline channel)
    setChatHistory([ ...chatHistory, chatMsg ])    
  }
 
  // create JSX list from chat history entries
  let jsxHistory = chatHistory.map((chatMsg, i) => (
    <div className="chat-msg" key={i}>
      <label>{chatMsg.user}:</label>
      <span>{chatMsg.text}</span>
    </div>
  ))

  return ( 
    <div id="history">
      <h2>Chat</h2>
      <div id="chat-area">{jsxHistory}</div>
      <form id="message-send" onSubmit={addChatMessageToHistory}>
        <input 
          autoComplete="off"
          ref={msgRef}
          placeholder={`Type your message, ${user.name}...`} />
        <button type="submit" >Send</button>
      </form>
    </div>
  )
}
 
export default ChatHistory;