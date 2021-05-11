const ContactList = ({ user, contacts, contact, setContact }) => {

  const jsxContacts = contacts.map(ctc => {

    if(user._id == ctc._id) return

    return <div key={ctc._id} onClick={(e) => setContact(ctc)} className="contact">
      { contact && contact._id == ctc._id ? <b>{ctc.name}</b> : ctc.name }
    </div>
  })

  return ( <div id="contacts">{ jsxContacts }</div> );
}
 
export default ContactList;