/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LessonsDashboard() {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [form, setForm] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = () => {
        axios.get('http://127.0.0.1:3000/lessons')
        .then(response => {
            setLessons(response.data);
        })
        .catch(error => {
            console.error('Error fetching lessons:', error);
        });
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedLesson) {
            axios.put(`http://127.0.0.1:3000/lessons/${selectedLesson.id}`, form)
            .then(() => {
                fetchLessons();
                resetForm();
            });
        } else {
            axios.post('http://127.0.0.1:3000/lessons', form)
            .then(() => {
                fetchLessons();
                resetForm();
            });
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:3000/lessons/${id}`)
        .then(() => {
            fetchLessons();
        });
    };

    const handleEdit = (lesson) => {
        setSelectedLesson(lesson);
        setForm(lesson);
    };

    const resetForm = () => {
        setForm({ title: '', description: '' });
        setSelectedLesson(null);
    };

    return (
        <div className="lessons-container2">
            {selectedLesson && (
                <div className="form-container2">
                    <h1>Edit Lesson</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            required
                            className="form-input"
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            required
                            className="form-textarea"
                        />
                        <button type="submit" className="button">Update</button>
                        <button type="button" className="button" onClick={resetForm}>Cancel</button>
                    </form>
                </div>
            )}
            <div className="lesson-list2">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="lesson-item">
                        <h2>{lesson.title}</h2>
                        <button onClick={() => handleEdit(lesson)} className="button">Edit</button>
                        <button onClick={() => handleDelete(lesson.id)} className="button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LessonsDashboard;