import './App.scss';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'
import axios, { MESSAGE_SERVER_URL } from './helpers/axios'
import ChatHistory from './ChatHistory';
import ContactList from './ContactList';
import Login from './Login'

function App() {

  const [socket, setSocket] = useState()
  const [user, setUser] = useState() // this is us :)
  const [contacts, setContacts] = useState([]) // this stores all our chat contacts
  const [contact, setContact] = useState() // this stores the chat contact we currently (!) have a chat with
  const [chatHistory, setChatHistory] = useState([]) // this stores the message history of the user we currently chat with

  // FETCH CHAT CONTACTS on load
  useEffect(() => {

    axios.get("/users")
    .then( res => {
      console.log(res.data)
      setContacts(res.data)
    })
    .catch(err => { 
      console.log("[ERROR] User fetching...")
      console.log(err.response ? err.response.data : "API not reachable")
    })

  }, [] )


  // ONCE CONTACT SELECTED / SWITCHED => initiate chat
  useEffect(() => {

    if(!contact) return

    // set user ID on connection!
    // other parties can then send messages directly to our userId!
    // by the way: exactly this call of the io(..) function will trigger the io.on("connection") event in the server.js file !
    const socket = io(MESSAGE_SERVER_URL, { query: `userId=${user._id}` }) // connect to API
    setSocket(socket)

    console.log("Fetching history of users: ", user._id, contact._id)
    
    // load chat history from server
    axios.get(`/chat-history/${user._id}/${contact._id}`)
    .then(res => {
      console.log("History: ", res.data)
      setChatHistory(res.data)
    })

    // Disconnect socket when leaving chat...
    return () => socket && socket.disconnect()

  }, [contact])
  

  const logout = () => {
    setContact()
    setUser()
    setChatHistory([])
  }


  return (
    <div className="App">

      {/* NAVBAR with login status */}
      <nav>
        { !user && <Login contacts={contacts} setUser={setUser} /> }
        { user && <>
          <span>Hello <b>{user.username.toUpperCase()}</b> </span> 
          <svg onClick={ logout } xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </> }
      </nav>

      {/* CHAT CONTAINER with two panels: chat contacts on the left, chat messages on the right */}
      <div id="chat-container">
        { user && contacts.length && 
          <ContactList 
            user={user} 
            contacts={contacts} 
            contact={contact} 
            setContact={setContact} 
          /> }
        { user && contact && 
          <ChatHistory 
            socket={socket} 
            user={user} 
            contact={contact} 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
          /> }
      </div>

    </div>
  );
}

export default App;
