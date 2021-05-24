const ContactList = ({ user, contacts, contact, setContact }) => {

  const jsxContacts = contacts.map(ctc => {

    if(user._id == ctc._id) return

    // style selected contact 
    let cssContact = contact && contact._id == ctc._id ? 'contact-selected' : ''

    return <div className={`contact ${cssContact}`} key={ctc._id} onClick={(e) => setContact(ctc)} >
      { ctc.username }
    </div>
  })

  return ( <div className="contacts">
    <h2>Contact List</h2>
    { jsxContacts }
  </div> );
}
 
export default ContactList;