import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ContactsLayout = () => {
    const [contacts, setContacts] = useState([])
    
        const fetchAllcontact = async() =>{
                try{
                    const res = await axios.get(`http://127.0.0.1:3000/contacts`)
                    setContacts(res.data)
                    
                }catch (e){
                    console.error("Failed to get all contacts")
                }
            }

    useEffect(() =>{
       fetchAllcontact()
    },[])

    const padZero = (num) => {
        return num.toString().padStart(2, '0');
    };

    const formatDateFR = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()} - ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
        return formattedDate;
    };


    return (
        <div className="dashboard">
            <h1>Messagerie</h1 >
            <ul> 
          
                {contacts.map((contact) => (
                 <Link key={contact.id} to={`/dashboard/contact/${contact.id}`} className="td-none">
                    <li className="item mbt-demi mt-demi p-b-t-2em"> 
                    
                            <p>{contact.name} - {contact.email} - {contact.subject} - {formatDateFR(contact.recieptDate)}</p>
                        </li>
                </Link>
                ))} 
            </ul>
        </div>
    );
};
    export default ContactsLayout
