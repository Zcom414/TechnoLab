import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MessageDetails = () => {
    const { id } = useParams();
    const [message, setMessage] = useState({});
    const [state , setState] = useState([])
 
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    const fetchOneContact = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:3000/contact/${id}`);
            setMessage(res.data[0]);

        } catch (e) {
            console.error("Failed to get this contact");
        }
    };

    useEffect(() => {
        fetchOneContact();
    }, [id]);

   

    const changeStatus = async () =>{
        try{
            const res = await axios.put(`http://127.0.0.1:3000/updateContact/${id}`)
        } catch (e) {
            console.error("Failed to change the status")
        }
    }

    useEffect (() =>{
        changeStatus();
    }, [id])
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

    const padZero = (num) => {
            return num.toString().padStart(2, '0');
    };
    const formatDateFR = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()} - ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
        return formattedDate;
    };

    return (
        <div>
            <section>
                <h2 className="email-message">{message.email}</h2>
                        <p className="mbt-demi mt-demi">{message.name}</p>
                    <p>{message.subject}</p>
                    <p>{message.message}</p>
                    <p>{formatDateFR(message.recieptDate)}</p>
            </section>
        </div>
    );
};

export default MessageDetails;