import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddLesson() {
    const [technologies, setTechnologies] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [levels, setLevels] = useState([]);
    const [formats, setFormats] = useState([]);
    const [form, setForm] = useState({
        title: '', underTitle: '', description: '', id_technologies: '', bases: '', 
        lessonTime: '', totalPrice: '', maxPlaces: '', img: '', altImg: '', 
        reference: '', id_levels: '', id_formats: '', img2:''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchTechnologies();
        fetchLessons();
        fetchFormats();
        fetchLevels();
    }, []);

    // Suppression de l'utilisation incorrecte de callback avec setForm
    useEffect(() => {
        if (form.img2) {
            console.log('img2 mis à jour:', form.img2);
        }
    }, [form.img2]);

    // Validation du formulaire
    const validateForm = () => {
        if (!form.title) return "Titre est requis";
        if (!form.underTitle) return "Sous-titre est requis";
        if (!form.description) return "Description est requise";
        if (!form.lessonTime) return "Durée de la leçon est requise";
        if (!form.totalPrice) return "Prix total est requis";
        if (!form.maxPlaces) return "Nombre de places maximales est requis";
        if (!form.id_levels) return "Niveau est requis";
        if (!form.id_formats) return "Format est requis";
        if (!form.img) return "Image est requise";
        return null;
    };

    const newLesson = async (event) => {
        event.preventDefault();
        const error = validateForm();
        if (error) {
            setErrorMessage(error);
            return;
        }

        if (selectedFile) {
            const uploadResult = await handleSubmit();
            if (!uploadResult) {
                return; // Exit if file upload fails
            }
        }

        axios.post(`${import.meta.env.VITE_API_URL}addlesson`, form)
            .then(response => {
                setForm({
                    title: '', underTitle: '', description: '', id_technologies: '', bases: '',
                    lessonTime: '', totalPrice: '', maxPlaces: '', img: '', altImg: '', 
                    reference: '', id_levels: '', id_formats: '', img2:''
                });
                setErrorMessage('');
                setSuccessMessage('Leçon ajoutée avec succès!');
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la leçon:', error);
                setErrorMessage('Erreur lors de l\'ajout de la leçon');
            });
    };

    const fetchLevels = () => {
        axios.get(`${import.meta.env.VITE_API_URL}levels`)
            .then(response => setLevels(response.data))
            .catch(error => console.error('Erreur lors de la récupération des niveaux:', error));
    };

    const fetchFormats = () => {
        axios.get(`${import.meta.env.VITE_API_URL}formats`)
            .then(response => setFormats(response.data))
            .catch(error => console.error('Erreur lors de la récupération des formats:', error));
    };

    const fetchLessons = () => {
        axios.get(`${import.meta.env.VITE_API_URL}lessons`)
            .then(response => setAllLessons(response.data))
            .catch(error => console.error('Erreur lors de la récupération des leçons:', error));
    };

    const fetchTechnologies = () => {
        axios.get(`${import.meta.env.VITE_API_URL}technologies`)
            .then(response => setTechnologies(response.data))
            .catch(error => console.error('Erreur lors de la récupération des technologies:', error));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setErrorMessage('Veuillez sélectionner un fichier.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setErrorMessage('Le fichier doit être une image.');
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrorMessage('La taille de l\'image ne doit pas dépasser 2 Mo.');
            return;
        }

        const acceptedExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/PNG'];
        if (!acceptedExtensions.includes(file.type)) {
            setErrorMessage('L\'extension de l\'image n\'est pas valide.');
            return;
        }

        setErrorMessage('');
        setSelectedFile(file);

        setForm(prevForm => ({
            ...prevForm,
            img: file.name
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Mise à jour de l'état du formulaire avec le nom de fichier modifié
            if (response.data) {
                setForm(prevForm => ({
                    ...prevForm,
                    img2: response.data.modifiedFileName
                }));
                console.log(form);
            } else {
                console.error('La réponse de l\'API est incorrecte:', response);
                setErrorMessage('La réponse de l\'API est incorrecte');
            }
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier:', error);
            setErrorMessage('Erreur lors de l\'upload du fichier');
            return false;
        }
    };

    return (
        <div>
            <h1>Ajouter une leçon</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form encType="multipart/form-data" className='center' onSubmit={newLesson}>
                <div className='flex-wr spc-ard'>
                    <div>
                        <label className='block'>Titre de la leçon</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className='block'>Sous-titre</label>
                        <input
                            type="text"
                            name="underTitle"
                            value={form.underTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className='mt-demi mbt-demi'>
                    <label className='block'>Image</label>
                    <input
                        id="img"
                        type='file'
                        name='img'
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div>
                    <label className='block'>Description de l'image</label>
                    <input
                        type="text"
                        name="altImg"
                        value={form.altImg}
                        onChange={handleChange}
                    />
                </div>
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Choisissez une technologie</label>
                    <select
                        className='w-tel'
                        name="id_technologies"
                        value={form.id_technologies}
                        onChange={handleChange}
                    >
                        <option value="">-- Choisir une technologie --</option>
                        {technologies.map(technology => (
                            <option key={technology.id} value={technology.id}>
                                {technology.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Description</label>
                    <textarea
                        rows="5"
                        cols="33"
                        className='w-descrip'
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <label className='block'>Les bases</label>
                <input
                    type="text"
                    name="bases"
                    value={form.bases}
                    onChange={handleChange}
                />
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Durée de la leçon</label>
                    <input
                        type="number"
                        name="lessonTime"
                        value={form.lessonTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Nombre de places maximales</label>
                    <input
                        type="number"
                        name="maxPlaces"
                        value={form.maxPlaces}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Référence</label>
                    <input
                        type='text'
                        name='reference'
                        value={form.reference}
                        onChange={handleChange}
                    />
                </div>
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Prix total</label>
                    <input
                        type='number'
                        name='totalPrice'
                        value={form.totalPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className='block'>Choisissez un format</label>
                    <select
                        className='w-tel'
                        name="id_formats"
                        value={form.id_formats}
                        onChange={handleChange}
                    >
                        <option value="">-- Choisir un format --</option>
                        {formats.map(format => (
                            <option key={format.id} value={format.id}>
                                {format.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mt-demi mbt-demi '>
                    <label className='block'>Choisissez un niveau</label>
                    <select
                        className='w-tel'
                        name="id_levels"
                        value={form.id_levels}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Choisir un niveau --</option>
                        {levels.map(level => (
                            <option key={level.id} value={level.id}>
                                {level.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className='block button-link' type="submit">Ajouter une leçon</button>
            </form>
        </div>
    );
}

export default AddLesson;
