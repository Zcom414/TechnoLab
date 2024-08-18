/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Success() {
    const navigate = useNavigate();

    useEffect(() => {
       
        localStorage.removeItem('cart'); // Supprime le panier après le paiement est valide
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000); // Redirection vers la page d'accueil après 5 seconds

        return () => clearTimeout(timer); 
    }, [navigate]);

    return (
        <div className="services-container" style={{height: '70vh'}}>
            <h1>Paiement réussi !</h1>
            <p>Merci pour votre achat. Votre commande a été traitée avec succès.</p>
            <p className='redirect'>Vous êtes redirigé vers la page d'accueil dans quelques secondes...</p>
        </div>
    );
}

export default Success;
