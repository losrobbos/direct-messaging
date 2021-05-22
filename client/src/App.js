import './App.scss';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'
import axios, { MESSAGE_SERVER_URL } from './helpers/axios'
import ChatHistory from './ChatHistory';
import ContactList from './ContactList';
import Login from './Login'

function App() {

  const [socket, setSocket] = useState()
  const [user, setUser] = useState()
  const [contact, setContact] = useState()
  const [contacts, setContacts] = useState([])
  const [chatHistory, setChatHistory] = useState([])

  // ONCE USER IS LOGGED IN => FETCH CHAT CONTACTS
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
    const socket = io(MESSAGE_SERVER_URL, { query: `userId=${user._id}` }) // connect to API
    setSocket(socket)

    // load chat history from server
    console.log("Fetching history of users: ", user._id, contact._id)
    axios.get(`/chat-history/${user._id}/${contact._id}`)
    .then(res => {
      console.log("History: ", res.data)
      setChatHistory(res.data)
    })

    // clear previous chat history...
    // setChatHistory([])

    // Disconnect to socket on leave...
    return () => socket && socket.disconnect()

  }, [contact])
  

  const logout = () => {
    setContact()
    setUser()
    setChatHistory()
  }


  return (
    <div className="App">
      <nav>
        { !user && <Login contacts={contacts} setUser={setUser} /> }
        { user && <><span>Hello {user.username}</span> <button onClick={ logout } >Logout</button></> }
      </nav>

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
