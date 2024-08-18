/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function decodeHtml(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    return doc.documentElement.textContent;
}

function LessonSingle() {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [level, setLevel] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/lesson/${id}`)
            .then(response => {
                console.log('Lesson data:', response.data);
                if (response.data && response.data.length > 0) {
                    const lessonData = response.data[0];
                    setLesson({
                        ...lessonData,
                        content: decodeHtml(lessonData.content)
                    });

                    // Fetch the level data based on the lesson data
                    axios.get(`${import.meta.env.VITE_API_URL}/levels/${lessonData.id_levels}`)
                        .then(levelResponse => {
                            console.log('Level data:', levelResponse.data);
                            if (levelResponse.data && Array.isArray(levelResponse.data) && levelResponse.data.length > 0) {
                                setLevel(levelResponse.data[0]);  
                            } else if (levelResponse.data) {
                                setLevel(levelResponse.data);
                            }
                        })
                        .catch(levelError => {
                            console.log('Error fetching level data:', levelError);
                            setLevel(null);
                        });
                } else {
                    console.log('No lesson found with that ID');
                    setLesson(null);
                }
            })
            .catch(lessonError => {
                console.log('Error fetching lesson data:', lessonError);
                setLesson(null);
            });
    }, [id]);

    if (!lesson) {
        return <div>Loading lesson details...</div>;
    }

    return (
        <div className="lesson-details-container py-16 section-block">
            <h1>Lesson Details</h1>
            <div className="lesson-details">
                <img src={`${import.meta.env.VITE_API_URL}/api/images/upload/${lesson.img}`} alt={lesson.title} style={{ margin: 'auto', display: 'block', width: '50%' }} />
                <h2 style={{ color: '#1E3799' }}>{lesson.title}</h2>
                <p><strong style={{ color: '#B71540', borderBottom: '1px solid #B71540' }}>Under Title:</strong> {lesson.underTitle}</p>
                <p>{lesson.description}</p>
                <p><strong style={{ color: '#B71540' }}>Les bases:</strong> {lesson.bases}</p>
                <p><strong style={{ color: '#B71540' }}>Le cours dure :</strong> {lesson.lessonTime} heures</p>
                <p><strong style={{ color: '#B71540' }}>Les places sont nombres maximum de :</strong> {lesson.maxPlaces}</p>
                <p><strong style={{ color: '#B71540' }}>Total du prix:</strong> {lesson.totalPrice} Euros</p>
                {level ? (
                    <div>
                        <p><strong style={{ color: '#B71540' }}>Le niveau est:</strong> {level.level}</p>
                        <p><strong style={{ color: '#B71540' }}>Le niveau:</strong> {level.id}</p>
                    </div>
                ) : (
                    <p>Loading level details...</p>
                )}
               <Link to={`/lesson/${lesson.id}/payment`} style={{ textDecoration: 'none' }}>
                    <button className="button" style={{ backgroundColor: '#079992', marginLeft: '0', padding: '0.5rem', fontSize: '1rem' }}>Ajouter au panier</button>
                </Link>

            </div>
        </div>
    );
}

export default LessonSingle;