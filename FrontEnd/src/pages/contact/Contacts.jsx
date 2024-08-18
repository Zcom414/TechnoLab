/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contacts = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subjectId, setSubjectId] = useState("1");
    const [message, setMessage] = useState("");
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/subjects`);
                setSubjects(res.data);
            } catch (e) {
                console.error("Failed to fetch subjects:", e);
            }
        };
        fetchSubjects();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const postData = {
            name,
            email,
            id_subjects: subjectId,  
            message
        };

        console.log('Form submitted:', postData);
        try {
            // Envoye la requête POSTER à l'API
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, postData);
            console.log('Server Response:', response.data);
            alert('Message envoyé avec succès!');
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Erreur lors de l\'envoi du message.');
        }
    };

    return (
        <article className="section-block">
            <h1 className="section-block__title mb-3">Contactez-nous</h1>
            <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
                <div className="form2">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder=""
                        className="form__input"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="name" className={name ? "form__label active" : "form__label"}>Name</label>
                </div>
                <div className="form2">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder=""
                        className="form__input"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email" className={email ? "form__label active" : "form__label"}>Email</label>
                </div>
                <div className="form2">
                    <select
                        name="id_subjects"
                        id="id_subjects"
                        className="form__input select"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                    >
                        {subjects.map((subject) => (
                            <option key={subject.id + subject.name} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>
                    <label htmlFor="id_subjects" className={subjectId ? "form__label active" : "form__label"}>Sujet de la demande</label>
                </div>
                <div className="form2">
                    <textarea
                        name="message"
                        id="message"
                        placeholder=""
                        rows="5"
                        cols="33"
                        className="form__input"
                        autoComplete="off"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <label htmlFor="message" className={message ? "form__label active" : "form__label"}>Message</label>
                </div>
                <div className='flex justify-between' style={{ margin: '0' }}>
                    <button type="reset" className="cancel btn-formulaire">Annuler</button>
                    <button type="submit" className="btn-formulaire confirm">Envoyer</button>
                </div>
            </form>
        </article>
    );
};

export default Contacts;