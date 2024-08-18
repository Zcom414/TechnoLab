/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthProvider'; 

const stripePromise = loadStripe("pk_test_51PJX1EJ9cNEOCcHhPnKT4sBxvL5xs9aQN7VTmRUabgl4khJ6k7KbYIcjJsHIhesao1lhsj0YYfIAjhn9hvAPxwLw008vby1XDo");

function Paiement() {
    const { id } = useParams();
    const [lessons, setLessons] = useState({});
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [details, setDetails] = useState({
        address: '',
        additionalAddress: '',
        zipCode: '',
        city: '',
        country: '',
        tel: '',
    });

    const navigate = useNavigate();
    const { isAuthenticated, customers } = useAuth(); 

    useEffect(() => {
        const savedLessons = JSON.parse(localStorage.getItem('cart')) || {};
        setLessons(savedLessons);

        if (id) {
            axios.get(`${import.meta.env.VITE_API_URL}/lesson/${id}`)
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        const lessonData = response.data[0];
                        const updatedLessons = {
                            ...savedLessons,
                            [lessonData.id]: {
                                ...lessonData,
                                content: decodeHtml(lessonData.content),
                                price: parseFloat(lessonData.totalPrice) || 0 
                            }
                        };
                        setLessons(updatedLessons);
                        localStorage.setItem('cart', JSON.stringify(updatedLessons));
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données de la leçon :', error);
                    setError('Erreur lors de la récupération des données de la leçon.');
                });
        }

        if (isAuthenticated()) {
            axios.get(`${import.meta.env.VITE_API_URL}/customer/${customers.id}`)
                .then(response => {
                    if (response.data) {
                        setUserDetails(response.data);
                        if (!response.data.address || !response.data.zipCode || !response.data.city || !response.data.country || !response.data.tel) {
                            setShowDetailsForm(true);
                        }
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
                    setError('Erreur lors de la récupération des informations de l\'utilisateur.');
                });
        }
    }, [id, isAuthenticated, customers]);

    function decodeHtml(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        return doc.documentElement.textContent;
    }

    const handleRemoveLesson = (lessonId) => {
        const updatedLessons = { ...lessons };
        delete updatedLessons[lessonId];
        setLessons(updatedLessons);
        localStorage.setItem('cart', JSON.stringify(updatedLessons));
    };

    const handleRemoveAllLessons = () => {
        setLessons({});
        localStorage.removeItem('cart');
    };

    const handleStripePayment = async () => {
        const stripe = await stripePromise;
      
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
            items: Object.keys(lessons).map(lessonId => ({
              id: lessonId,
              price: lessons[lessonId].price,
              quantity: 1,
            })),
            id_customers: customers.id // Inclure l'ID du client pour un test rapide
          });
      
          const session = response.data;
      
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
      
          if (result.error) {
            setError(result.error.message);
          } else {
            localStorage.removeItem('cart');
          }
        } catch (error) {
          console.error('Error during Stripe payment:', error);
          setError('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
        }
      };
      

    const handleDetailsChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value,
        });
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/customer/${customers.id}/details`, details, {
                headers: {
                    'Authorization': `Bearer ${customers.token}`
                }
            });
            setShowDetailsForm(false);
            setUserDetails({ ...userDetails, ...details });
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations personnelles :', error);
            setError('Erreur lors de la mise à jour des informations personnelles.');
        }
    };
    
    const totalAmount = Object.keys(lessons).reduce((total, lessonId) => {
        const lesson = lessons[lessonId];
        const quantity = 1;

        const price = parseFloat(lesson.price);
        if (isNaN(price)) {
            console.error(`Invalid number detected. Lesson ID: ${lessonId}, Price: ${lesson.price}`);
            return total;
        }

        return total + (price * quantity);
    }, 0);

    return (
        <div className="paiement-container section-block">
            <div className="header flex justify-between align-center">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3799' }}>
                    <img src={`${import.meta.env.VITE_LOGO_URL}`} alt="logo" style={{ width: '2rem', height: '2rem' }} /> TechnoLab
                </h1>
                {!isAuthenticated() && (
                    <p onClick={() => navigate('/connexion')}>
                        <FontAwesomeIcon icon={faCircleUser} size='2xl' style={{ color: '#1e3799', cursor: 'pointer' }} /> 
                        Merci de bien vouloir vous identifier SVP
                    </p>
                )}
            </div>            
            <h2>Mon panier</h2>
            {error && <p className="error-message">{error}</p>}
            {Object.keys(lessons).map(lessonId => {
                const lesson = lessons[lessonId];
                return (
                    <div key={lesson.id} className="cart-item">
                        <div className="cart-item-info">
                            <img src={`/public/images/upload/${lesson.img}`} alt={lesson.title} className="lesson-image" />
                            <h3>{lesson.title}</h3>
                            <p>{lesson.underTitle}</p>
                            <p>Prix unitaire: {lesson.price.toFixed(2)} €</p>
                        </div>
                        <p>Total: {(lesson.price).toFixed(2)} €</p> {/* Total basé sur une quantité de 1 */}
                        <button onClick={() => handleRemoveLesson(lesson.id)} className="btn-remove-lesson">Supprimer</button>
                    </div>
                );
            })}
            <div className="total-amount">
                <h3>Total général: {totalAmount.toFixed(2)} €</h3>
                <button onClick={handleRemoveAllLessons} className="btn-remove-all">Supprimer tous les cours</button>
                {isAuthenticated() ? (
                    showDetailsForm ? (
                        <form onSubmit={handleDetailsSubmit}>
                            <div className="form-group">
                                <label htmlFor="address">Adresse :</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={details.address}
                                    onChange={handleDetailsChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="additionalAddress">Complément d'adresse :</label>
                                <input
                                    type="text"
                                    id="additionalAddress"
                                    name="additionalAddress"
                                    value={details.additionalAddress}
                                    onChange={handleDetailsChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipCode">Code postal :</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={details.zipCode}
                                    onChange={handleDetailsChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">Ville :</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={details.city}
                                    onChange={handleDetailsChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Pays :</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={details.country}
                                    onChange={handleDetailsChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tel">Téléphone :</label>
                                <input
                                    type="tel"
                                    id="tel"
                                    name="tel"
                                    value={details.tel}
                                    onChange={handleDetailsChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-payment">Enregistrer les informations</button>
                        </form>
                    ) : (
                        <button onClick={handleStripePayment} className="btn-payment">Payer avec Stripe</button>
                    )
                ) : (
                    <button onClick={() => navigate('/connexion')} className="btn-payment">Se connecter pour payer</button>
                )}
            </div>
        </div>
    );
}

export default Paiement;