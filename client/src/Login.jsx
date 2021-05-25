import { useRef } from 'react';
import axios from './helpers/axios'

const Login = ({ contacts, setUser }) => {

  const userRef = useRef()

  // LOGIN USER AT API
  const login = async (e) => {

    e.preventDefault()
    
    const userName = userRef.current.value;

    if (!userName) return alert('Please state username, buddy...');

    try {
      const res = await axios.post('/login', { name: userName });
      setUser(res.data);
    } catch (err) {
      console.log('[ERROR] Login...');
      console.log(err.response ? err.response.data : 'API not reachable');
      setUser();
    }
  };

  return (
    <form className="login" onSubmit={login}>
      <input type="text" ref={ userRef } />
      <button type="submit">Login</button>
      <select onChange={(e) => userRef.current.value = e.target.value }>
        <option value="">(none)</option>
        {contacts.map(contact => <option key={contact._id} value={contact.username}>{contact.username}</option>)}
      </select>
    </form>
  );
};

export default Login;
