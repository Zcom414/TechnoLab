/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Lessons() {
    const [technologies, setTechnologies] = useState([]);
    const [selectedTechnologie, setSelectedTechnologie] = useState();
    const [lessons, setLessons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(`${import.meta.env.VITE_ITEMS_PER_PAGE}`);
    const { id } = useParams();
    // const [lesson, setLesson] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    function decodeHtml(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        return doc.documentElement.textContent;
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/technologies/`)
            .then(response => {
                setTechnologies(response.data);
            })
            .catch(error => console.error('Error fetching technologies:', error));
        fetchLessons();
    }, []);

    const fetchLessons = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/lessons`)
            .then(response => {
                setLessons(response.data);
            })
            .catch(error => console.error('Error fetching lessons:', error));
    };

    useEffect(() => {
        if (selectedTechnologie) {
            axios.get(`${import.meta.env.VITE_API_URL}/lessons/${selectedTechnologie.id}`)
                .then(response => {
                    setLessons(response.data);
                })
                .catch(error => console.error('Error fetching lessons for selected technology:', error));
        } else {
            fetchLessons();
        }
    }, [selectedTechnologie]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/lesson/${id}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    const lessonData = response.data[0];
                    setLessons({
                        ...lessonData,
                        content: decodeHtml(lessonData.content)
                    });
                }
            })
            .catch(error => console.log('Error fetching lesson data:', error));
    }, [id]);

    // Filtrer les cours
    //  Dans un premier temps, on filtre les cours par technologies
    //  Ensuite, on filtre les cours par titre, sous-titre, technologie et niveau
    const filteredLessons = lessons.filter(lesson => {
        const searchTerms = searchTerm.toLowerCase().split(" ");
        return searchTerms.every(term =>
            lesson.title.toLowerCase().includes(term) ||
            lesson.underTitle.toLowerCase().includes(term) ||
            (lesson.technologyName && lesson.technologyName.toLowerCase().includes(term)) ||
            (lesson.level && lesson.level.toLowerCase().includes(term))
        );
    });
    console.log(filteredLessons);
    console.log(searchTerm);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLessons.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="lessons-container-2 section-block">
            <h1>Technologies</h1>
            <div className="languages">
                <a className={selectedTechnologie === null ? 'selected-technologie' : ''} href="#" onClick={() => setSelectedTechnologie(null)}>Toutes
                </a>
                {technologies.map(tech => (
                    <a key={tech.id} className={selectedTechnologie === tech ? 'selected-technologie' : ''} href="#" onClick={() => setSelectedTechnologie(tech)}>
                        {tech.name}
                    </a>
                ))}
            </div>
            <div className="form2">
                <input type="text" name='search' id='search' placeholder="" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form__input2" />
                <label htmlFor="search" className={searchTerm ? "form__label2 active" : "form__label2"}>Recherche</label>
                <button onClick={() => setSearchTerm('')} className="btn2 color12">Effacer</button>
                {/* afficher le resultat trouvé de façon ergonomique si il y a plusieurs resultats cela prendra un s*/}
                <p className="result">
                    {`Il y a ${filteredLessons.length} leçon${filteredLessons.length !== 1 ? 's' : ''} qui correspond${lessons.length !== 1 ? 'ent' : ''} à votre recherche`}
                </p>

            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '10px', border: '1px solid #ccc', margin: '20px 0' }}>
                {currentItems.map(lesson => (
                    <div key={lesson ? lesson.id : 'loading'} className="lesson-list" style={{ textAlign: 'center', padding: '10px', margin: 'auto' }}>
                        <Link to={`/lesson/${lesson.id}`}>
                            <img src={`${import.meta.env.VITE_API_URL}/api/images/upload/${lesson.img}`} alt={lesson.title} style={{ width: '50%', height: '50%', objectFit: 'cover', margin: 'auto', display: 'block' }} />
                        </Link>
                        <h2 style={{ margin: '10px 0', fontSize: '20px' }}>{lesson.title}</h2>
                        <p>{lesson.underTitle}</p>
                        <p>{lesson.level}</p>
                        <hr style={{ width: '50%', margin: 'auto', fontSize: '20px' }} />
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredLessons.length / itemsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Lessons;
