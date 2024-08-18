/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

function LessonUpdateStatut() {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = () => {
        axios.get('http://127.0.0.1:3000/lessons')
        .then(response => {
            setLessons(response.data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des leçons:', error);
        });
    };

    const updateLessonStatut = (lesson) => {
        const newStatut = lesson.statut === 1 ? 0 : 1;
        axios.put(`http://127.0.0.1:3000/changelessonstatut/${lesson.id}`, { statut: newStatut })
        .then(response => {
            // Mettre à jour le statut de la leçon dans l'état local
            setLessons(prevLessons =>
                prevLessons.map(l =>
                    l.id === lesson.id ? { ...l, statut: newStatut } : l
                )
            );
        })
        .catch(error => {
            console.error('Erreur lors du changement de statut:', error);
        });
    };

    return (
        <div>
            <h1>Mettre à jour le statut des leçons</h1>
            <ul className='user-list'>
                {lessons.map(lesson => (
                    <li key={lesson.id} className="item mbt-demi mt-demi p-b-t-2em">
                        {lesson.title} - {lesson.underTitle} 

                        <div className='flex-wr mt-demi spc-ard'>
                            <button 
                                className={classNames({
                                    'valid-btn': lesson.statut === 0,
                                    'del-btn': lesson.statut === 1
                                })}
                                onClick={() => updateLessonStatut(lesson)}
                            >
                                {lesson.statut === 0 ? 'Activer' : 'Désactiver'}
                            </button>
                            <Link to={`/changelessonstatut/${lesson.id}`}>
                                <button className='yellow-btn'>
                                    Modifier
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LessonUpdateStatut;
