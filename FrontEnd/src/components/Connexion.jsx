/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthProvider'; // Import de useAuth depuis AuthContext

import errorIcon from '/images/site/warning.gif';
import successIcon from '/images/site/validation.png';

const Connexion = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        try {
            const success = await login(email, password);
            if (success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setErrors(["Échec de la connexion. Vérifiez vos identifiants."]);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setErrors(["Erreur lors de la connexion. Veuillez réessayer."]);
        }
    };

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            setSuccess(false);
            navigate('/'); // Rediriger vers la page d'accueil après la déconnexion
        } else {
            console.error("Erreur lors de la déconnexion");
        }
    };

    return (
        <article className="services-container">
            <section className="form">
                <h2>Connexion</h2>
                {isAuthenticated() ? (
                    <div className="success">
                        <p>Bonjour, vous êtes connecté  !</p>
                        <button onClick={handleLogout}>Se déconnecter</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Affichage des erreurs si elles existent */}
                        {errors.length > 0 && (
                            <div id="messagesErrors" className="error">
                                <img src={errorIcon} alt="Warning" className="imgErrorAndValid" />
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index} className="fsz2">{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* Affichage du succès                        message de validation */}
                        {success && (
                            <div id="messageValidation" className="success">
                                <img src={successIcon} alt="Success" className="imgErrorAndValid" />
                                <ul>
                                    <li className="fsz2">Connexion réussie !</li>
                                    <li className="fsz2">Redirection en cours...</li>
                                </ul>
                            </div>
                        )}
                        <div className="form2">
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder=""
                                className="form__input"
                                autoComplete="off"
                                value={email}
                                onChange={handleInputChange(setEmail)}
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
                                onChange={handleInputChange(setPassword)}
                            />
                            <label htmlFor="password" className={password ? "form__label active" : "form__label"}>Mot de passe</label>
                        </div>
                        <div className='flex justify-between' style={{ margin: '0' }}>
                            <Link to="/" className="btn cancel">Annuler</Link>
                            <input type="submit" value="Se connecter" className="btn confirm" />
                        </div>
                    </form>
                )}
            </section>
        </article>
    );
}

export default Connexion;