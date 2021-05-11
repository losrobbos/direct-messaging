import './App.css';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client'
import axios from 'axios'
import ChatHistory from './ChatHistory';
import ContactList from './ContactList';

const MESSAGE_SERVER_URL = process.env.MESSAGE_SERVER_URL || "http://localhost:5000/"
axios.defaults.baseURL = MESSAGE_SERVER_URL

function App() {

  const [socket, setSocket] = useState()
  const [user, setUser] = useState()
  const [contact, setContact] = useState()
  const [contacts, setContacts] = useState([])
  const [chatHistory, setChatHistory] = useState([])

  const userRef = useRef()

  // ONCE USER IS LOGGED IN => FETCH CHAT CONTACTS
  useEffect(() => {

    if(!user) return

    axios.get("/users")
    .then( res => {
      console.log(res.data)
      setContacts(res.data)
    })
    .catch(err => { 
      console.log("[ERROR] User fetching...")
      console.log(err.response ? err.response.data : "API not reachable")
    })

  }, [user])


  // ONCE CONTACT SELECTED / SWITCHED => initiate chat
  useEffect(() => {

    if(!contact) return

    // set user ID on connection!
    // other parties can then send messages directly to our userId!
    const socket = io(MESSAGE_SERVER_URL, { query: `userId=${user._id}` }) // connect to API
    setSocket(socket)

    // clear previous chat history...
    setChatHistory([])

    // Disconnect to socket on leave...
    return () => socket && socket.disconnect()

  }, [contact])
  

  // LOGIN USER AT API
  const login = async () => {
    const userName = userRef.current.value

    if(!userName) return alert("Please state username, buddy...")
    
    try {
      const res = await axios.post("/login", { name: userName })
      setUser(res.data)
    }
    catch(err) {
      console.log("[ERROR] Login...")
      console.log(err.response ? err.response.data : "API not reachable")
      setUser()
    }
  }

  const logout = () => {
    setContact()
    setUser()
    setChatHistory()
  }


  return (
    <div className="App">
      <nav>
        { !user && <><input type="text" ref={userRef} /><button onClick={ login }>Login</button></> }
        { user && <><span>Hello {user.name}</span> <button onClick={ logout } >Logout</button></> }
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
