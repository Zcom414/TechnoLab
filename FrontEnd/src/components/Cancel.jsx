/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cancel() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/payment');
        }, 5000); // Redirige après 5 secondes

        return () => clearTimeout(timer); // Nettoie le timer à la désactivation du composant
    }, [navigate]);

    return (
        <div className="services-container" style={{height: '70vh'}}>
            <h1>Paiement annulé</h1>
            <p>Votre paiement a été annulé. Vous pouvez réessayer ou contacter notre support si vous avez besoin d'aide.</p>
            <p>Vous allez être redirigé vers la page de paiement dans quelques secondes...</p>
        </div>
    );
}

export default Cancel;