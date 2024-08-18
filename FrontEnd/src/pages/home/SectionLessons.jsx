/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import arduino from '/images/techno/arduino.jpeg';
import carteArduino from '/images/upload/image5.jpg';
import gravure from '/images/techno/gravure.jpg';
import electronique from '/images/techno/electronique.jpg';
import impression from '/images/techno/impression_1.jpg';
import impression2 from '/images/techno/impression_2.jpg';

const SectionLessons = () => {
    // Définir un état local pour gérer la visibilité et le texte descriptif
    const [activeDescription, setActiveDescription] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [descriptions, setDescriptions] = useState({
        arduino: "Tout sur les bases de l'arduino",
        carteArduino: "Les différentes cartes Arduino",
        gravure: "Les principes de gravure et de découpe",
        electronique: "Liste des composants utils pour travailler",
        impression: "Les différentes imprimantes filaires",
        impression2: "Les différentes imprimantes résine"
    });

    // Fonction pour basculer l'état du texte descriptif
    const toggleDescription = (descriptionKey) => {
        setActiveDescription(activeDescription === descriptionKey ? null : descriptionKey);
    };

    return (
        <section className="lessons-container services-container">
            <div className="lesson-list">
                <img src={arduino} alt="logo arduino"/>
                <h3><strong>LES BASES DE L'ARDUINO</strong></h3>
                {activeDescription === 'arduino' && <p>{descriptions.arduino}</p>}
                <button onClick={() => toggleDescription('arduino')} className='btn color20'>Voir plus</button>
            </div>
            <div className="lesson-list">
                <img src={carteArduino} alt="plaque arduino uno" onClick={() => toggleDescription('carteArduino')} />
                <h3><strong>LES CARTES ARDUINO</strong></h3>
                {activeDescription === 'carteArduino' && <p>{descriptions.carteArduino}</p>}
                <button onClick={() => toggleDescription('arduino')} className='btn color20'>Voir plus</button>
            </div>
            <div className="lesson-list">
                <img src={gravure} alt="logo gravure" onClick={() => toggleDescription('gravure')} />
                <h3><strong>LES BASES DE LA GRAVURE</strong></h3>
                {activeDescription === 'gravure' && <p>{descriptions.gravure}</p>}
                <button onClick={() => toggleDescription('gravure')} className='btn color20'>Voir plus</button>
            </div>
            <div className="lesson-list">
                <img src={electronique} alt="Quelques composants électronique" onClick={() => toggleDescription('electronique')} />
                <h3><strong>LES COMPOSANTS ELECTRONIQUE</strong></h3>
                {activeDescription === 'electronique' && <p>{descriptions.electronique}</p>}
                <button onClick={() => toggleDescription('electronique')} className='btn color20'>Voir plus</button>
            </div>
            <div className="lesson-list">
                <img src={impression} alt="Image d'une imprimante 3D filaire" onClick={() => toggleDescription('impression')} />
                <h3><strong>LES BASES DE L'IMPRESSION FDM</strong></h3>
                {activeDescription === 'impression' && <p>{descriptions.impression}</p>}
                <button onClick={() => toggleDescription('impression')} className='btn color20'>Voir plus</button>
            </div>
            <div className="lesson-list">
                <img src={impression2} alt="Image d'une imprimante 3D résine" onClick={() => toggleDescription('impression2')} />
                <h3><strong>LES BASES DE L'IMPRESSION SLA</strong></h3>
                {activeDescription === 'impression2' && <p>{descriptions.impression2}</p>}
                <button onClick={() => toggleDescription('impression2')} className='btn color20'>Voir plus</button>
            </div>
        </section>
    );
}

export default SectionLessons;
