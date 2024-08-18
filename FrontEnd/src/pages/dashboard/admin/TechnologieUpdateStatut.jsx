import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';

/* By Jules */
function TechnologieUpdateStatut() {
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
        fetchTechnologies()
    }, []);

    const fetchTechnologies = () => {
        axios.get('http://127.0.0.1:3000/technologies')
        .then(response => {
            setTechnologies(response.data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des technologies:', error);
        });
    };

    const updateTechnologieStatut = (technologie) => {
        const newStatut = technologie.statut === 1 ? 0 : 1;
        axios.put(`http://127.0.0.1:3000/changetechnologiestatut/${technologie.id}`, { statut: newStatut })
        .then(response => {
            // Mettre à jour le statut de la technologie dans l'état local
            setTechnologies(prevTechnologies =>
                prevTechnologies.map(t =>
                    t.id === technologie.id ? { ...t, statut: newStatut } : t
                )
            );
        })
        .catch(error => {
            console.error('Erreur lors du changement de statut:', error);
        });
    };

    return (
        <div>
            <h1>Mettre à jour le statut des technologies</h1>
            <ul className='user-list'>
                {technologies.map(technologie => (
                    <li key={technologie.id} className="item mbt-demi mt-demi p-b-t-2em">
                        {technologie.name}
                        <div className='flex-wr center'>
                            <button
                                className={classNames('mt-demi', {
                                    'valid-btn': technologie.statut === 0,
                                    'del-btn': technologie.statut === 1
                                })}
                                onClick={() => updateTechnologieStatut(technologie)}
                            >
                                {technologie.statut === 0 ? 'Activer' : 'Désactiver'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TechnologieUpdateStatut;
