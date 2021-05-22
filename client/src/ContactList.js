const ContactList = ({ user, contacts, contact, setContact }) => {

  const jsxContacts = contacts.map(ctc => {

    if(user._id == ctc._id) return

    return <div className="contact" key={ctc._id} onClick={(e) => setContact(ctc)} >
      { contact && contact._id == ctc._id ? <b>{ctc.username}</b> : ctc.username }
    </div>
  })

  return ( <div className="contacts">
    <h2>Contact List</h2>
    { jsxContacts }
  </div> );
}
 
export default ContactList;