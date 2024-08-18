/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import errorIcon from '/images/site/warning.gif';
import successIcon from '/images/site/validation.png';

const Inscription = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
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

        if (!validatePassword(password)) {
            newErrors.push("Votre mot de passe doit contenir 8 caractères, 1 majuscule, et au moins un chiffre.");
        }

        if (password !== confirmedPassword) {
            newErrors.push("Les mots de passe ne correspondent pas !");
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setSuccess(false);
        } else {
            setErrors([]);
            const customerData = {
                lastname,
                firstname,
                email,
                password
            };

            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/customers/register`, customerData);
                console.log("Réponse du serveur :", response.data);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/connexion');
                }, 2000);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    newErrors.push("Cette adresse e-mail est déjà utilisée");
                } else {
                    newErrors.push("Erreur lors de l'inscription. Veuillez réessayer.");
                }
                setErrors(newErrors);
                setSuccess(false);
            }
        }
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    };

    return (
        <article className="">
            <section className="form">
                <h2>Création d'un compte !</h2>
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
                                <li className="fsz2">Votre compte a bien été créé.</li>
                                <li className="fsz2">Un email de validation vient de vous être envoyé !</li>
                            </ul>
                        </div>
                    )}
                    <legend>Merci de renseigner les informations suivantes :</legend>
                    <div className="form2">
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            placeholder=""
                            className="form__input"
                            autoComplete="off"
                            value={firstname}
                            onChange={(e) => handleInputChange(e, setFirstname)}
                        />
                        <label htmlFor="firstname" className={firstname ? "form__label active" : "form__label"}>Nom</label>
                    </div>
                    <div className="form2">
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            placeholder=""
                            className="form__input"
                            autoComplete="off"
                            value={lastname}
                            onChange={(e) => handleInputChange(e, setLastname)}
                        />
                        <label htmlFor="lastname" className={lastname ? "form__label active" : "form__label"}>Prénom</label>
                    </div>
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
                    <div className="form2">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder=""
                            className="form__input"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => handleInputChange(e, setPassword)}
                        />
                        <label htmlFor="password" className={password ? "form__label active" : "form__label"}>Choisissez un mot de passe</label>
                    </div>
                    <div className="form2">
                        <input
                            type="password"
                            name="password_confirme"
                            id="password_confirme"
                            placeholder=""
                            className="form__input"
                            autoComplete="off"
                            value={confirmedPassword}
                            onChange={(e) => handleInputChange(e, setConfirmedPassword)}
                        />
                        <label htmlFor="password_confirme" className={confirmedPassword ? "form__label active" : "form__label"}>Confirmez le mot de passe choisi</label>
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

export default Inscription;