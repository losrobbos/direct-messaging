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
      if(chatMsg.senderId._id != contact._id) {
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
      msg: msgRef.current.value, 
      senderId: {
        _id: user._id,
        username: user.username
      },
      receiverId: contact._id }
    msgRef.current.value = "" // clear input box

    // send an EVENT to server! (to a hotline channel)
    socket.emit('message', chatMsg) 
    setChatHistory([ ...chatHistory, chatMsg ]) // add to local history too
  }
 
  // create JSX list from chat history entries
  let jsxHistory = (chatHistory || []).map((chatMsg, i) => (
    <div className="chat-msg" key={i}>
      <label>{chatMsg.senderId.username}:</label>
      <span>{chatMsg.msg}</span>
    </div>
  ))

  return ( 
    <div id="chat-history">
      <h2>Chat</h2>
      <div className="chat-messages">
        {jsxHistory}
      </div>
      <form className="frm-message" onSubmit={addChatMessageToHistory}>
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