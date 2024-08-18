/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const { customers } = useAuth();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [address, setAddress] = useState('');
    const [additionalAddress, setAdditionalAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [tel, setTel] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer/${customers.id}`, {
                    headers: {
                        'Authorization': `Bearer ${customers.token}`
                    }
                });
                console.log('User data fetched:', response.data);
                setUserData(response.data);
                setUpdatedEmail(response.data.email);
                setAddress(response.data.address || '');
                setAdditionalAddress(response.data.additionalAddress || '');
                setZipCode(response.data.zipCode || '');
                setCity(response.data.city || '');
                setCountry(response.data.country || '');
                setTel(response.data.tel || '');
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
                setError('Erreur lors de la récupération des données de l\'utilisateur.');
            }
        };

        if (customers && customers.id) {
            fetchUserData();
        }
    }, [customers]);

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        console.log('Submitting update email form:', { email: updatedEmail, address, additionalAddress, zipCode, city, country, tel });
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/customer/${customers.id}/email`, {
                email: updatedEmail,
                address,
                additionalAddress,
                zipCode,
                city,
                country, // Le nom du pays est envoyé
                tel
            }, {
                headers: {
                    'Authorization': `Bearer ${customers.token}`
                }
            });
            console.log('Update response:', response.data);
            setUserData(prevData => ({
                ...prevData,
                email: updatedEmail,
                address,
                additionalAddress,
                zipCode,
                city,
                country, // Ici on envoie le nom du pays
                tel
            }));
            setEditMode(false);
            setError(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'email :', error.response?.data || error.message);
            setError('Erreur lors de la mise à jour de l\'email.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Chargement des données...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Profil Utilisateur</h2>
            <div className="profile-header">
                <FontAwesomeIcon icon={faUserCircle} size="5x" />
                <h3>Bonjour, {userData.lastname}!</h3>
            </div>
            <div className="profile-details">
                <p><strong>Nom :</strong> {userData.lastname}</p>
                <p><strong>Prénom :</strong> {userData.firstname}</p>
                {!editMode ? (
                    <div>
                        <p><strong>Email :</strong> {userData.email} <button onClick={() => setEditMode(true)}>Modifier</button></p>
                        <p><strong>Adresse :</strong> {userData.address}</p>
                        <p><strong>Complément d'adresse :</strong> {userData.additionalAddress}</p>
                        <p><strong>Code postal :</strong> {userData.zipCode}</p>
                        <p><strong>Ville :</strong> {userData.city}</p>
                        <p><strong>Pays :</strong> {userData.country}</p>
                        <p><strong>Téléphone :</strong> {userData.tel}</p>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateEmail}>
                        <div className="form-group">
                            <label htmlFor="email">Email :</label>
                            <input
                                type="email"
                                id="email"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Adresse :</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="additionalAddress">Complément d'adresse :</label>
                            <input
                                type="text"
                                id="additionalAddress"
                                value={additionalAddress}
                                onChange={(e) => setAdditionalAddress(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="zipCode">Code postal :</label>
                            <input
                                type="text"
                                id="zipCode"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Ville :</label>
                            <input
                                type="text"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Pays :</label>
                            <input
                                type="text"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tel">Téléphone :</label>
                            <input
                                type="text"
                                id="tel"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                            />
                        </div>
                        <button type="submit">Enregistrer</button>
                        <button type="button" onClick={() => setEditMode(false)}>Annuler</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;


