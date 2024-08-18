/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import errorIcon from '/images/site/warning.gif';
import successIcon from '/images/site/validation.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = [];

        if (!validateEmail(email)) {
            newErrors.push("Veuillez renseigner une adresse email valide !");
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setSuccess(false);
        } else {
            setErrors([]);
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/customers/forgot-password`, { email });
                console.log("Réponse du serveur :", response.data);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    newErrors.push("Cette adresse e-mail n'est pas enregistrée");
                } else {
                    newErrors.push("Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.");
                }
                setErrors(newErrors);
                setSuccess(false);
            }
        }
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    return (
        <article className="">
            <section className="form">
                <h2>Réinitialisation du mot de passe</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {errors.length > 0 && (
                        <div id="messagesErrors" className="error">
                            <div>
                                <img src={errorIcon} alt="Warning" className="imgErrorAndValid" />
                            </div>
                            <ul>
                                {errors.map((error, index) => (
                                    <li key={index} className="fsz2">{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {success && (
                        <div id="messageValidation" className="success">
                            <div>
                                <img src={successIcon} alt="Success" className="imgErrorAndValid" />
                            </div>
                            <ul>
                                <li className="fsz2">Un email de réinitialisation du mot de passe a été envoyé.</li>
                            </ul>
                        </div>
                    )}
                    <legend>Merci de renseigner votre adresse email pour recevoir un lien de réinitialisation</legend>
                    <div className="form2">
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder=""
                            className="form__input"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => handleInputChange(e, setEmail)}
                        />
                        <label htmlFor="email" className={email ? "form__label active" : "form__label"}>Email</label>
                    </div>
                    <div className='flex justify-between' style={{ margin: '0' }}>
                        <a href="#" className="cancel btn-formulaire">Annuler</a>
                        <input type="submit" name="valider" value="Valider" className="btn-formulaire confirm" />
                    </div>
                </form>
            </section>
        </article>
    );
}

export default ForgotPassword;