import { useEffect, useRef, useState } from "react"

const ChatHistory = ({ user, contact, socket, chatHistory, setChatHistory }) => {

  const msgRef = useRef() // store fresh message

  // define listeners AFTER connection is setup
  useEffect(() => {

    if(!socket) return // it makes no sense to listen for messaging, if we have no socket connection :)

    // when receiving new message - 
    socket.on("message", (chatMsg) => {
      console.log("Received message from server: ", chatMsg)

      // ONLY add messages to history if it was sent by current contact...
      if(chatMsg.senderId._id != contact._id) {
        console.log("Message discarded... non active room user")
        return
      }

      setChatHistory([...chatHistory, chatMsg]) // append new message to chat history
    })

    return () => socket && socket.off('message') // unregister message event listening...

  }, [socket, chatHistory]) // this effect will FIRE when the socket was set!



  // send direct message to other contact
  const sendMessage = (e) => {
    e.preventDefault()

    if(!msgRef.current.value) return alert("Please state a message")

    // construct message object
    let chatMsg = { 
      msg: msgRef.current.value, 
      // specify who sent the message
      senderId: {
        _id: user._id,
        username: user.username
      },
      receiverId: contact._id 
    }

    msgRef.current.value = "" // clear input box

    // send an EVENT to server! (to a hotline channel)
    socket.emit('message', chatMsg) 
    setChatHistory([ ...chatHistory, chatMsg ]) // add to local history too
  }
 
  // create Chat history list
  let jsxHistory = (chatHistory || []).map((chatMsg, i) => {
    // whatsapp FLOW STYLING
    let cssMsg = chatMsg.senderId._id == user._id ? 'chat-msg-me' : 'chat-msg-other'
    return <div className={`chat-msg ${cssMsg}`} key={i} >
      <label>{chatMsg.senderId.username}:</label>
      <span>{chatMsg.msg}</span>
    </div>
  })

  return ( 
    <div className="chat-history">
      <h2>Chat</h2>
      <div className="chat-messages">
        {jsxHistory}
      </div>
      <form className="frm-message" onSubmit={sendMessage}>
        <input 
          autoComplete="off"
          ref={msgRef}
          placeholder={`Type your message, ${user.username}...`} />
        <button type="submit" >Send</button>
      </form>
    </div>
  )
}
 
export default ChatHistory;