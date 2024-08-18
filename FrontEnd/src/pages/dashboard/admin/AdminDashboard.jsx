/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

function AdminPanel() {
    const [recettes, setRecettes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedRecette, setSelectedRecette] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonctions pour les interactions de sélection
    const toggleSelectedRecette = (recette) => {
        setSelectedRecette(selectedRecette && selectedRecette.id === recette.id ? null : recette);
        setSelectedUser(null);
    };


    const toggleSelectedUser = (user) => {
        setSelectedUser(selectedUser && selectedUser.id === user.id ? null : user);
    };

    // Fonctions pour les actions de gestion des recettes
    const updateRecette = (id, newDetails) => {
        setRecettes(recettes.map(recette => recette.id === id ? { ...recette, ...newDetails } : recette));
    };

    const deleteRecette = (id) => {
        setRecettes(recettes.filter(recette => recette.id !== id));
    };

    // Fonctions pour les actions de gestion des utilisateurs
    const deleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
        setSelectedUser(null);
    };

    const changeUserRole = async (userId, newRole) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        setSelectedUser(null);
      
        try {
          const response = await fetch(`http://localhost:3000/contacts/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }) 
          });
      
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to update the user role");
          }
          console.log("Updated successfully:", data);
        } catch (error) {
          console.error("Error updating user role:", error);
        }
      };

    // Chargement des données depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resRecettes = await fetch('http://localhost:3000/recettes');
                const dataRecettes = await resRecettes.json();
                if (Array.isArray(dataRecettes)) {
                    setRecettes(dataRecettes);
                } else {
                    console.error('Data fetched for recettes is not an array:', dataRecettes);
                }

                const resUsers = await fetch('http://localhost:3000/users');
            const dataUsers = await resUsers.json();
            if (dataUsers.status && Array.isArray(dataUsers.result)) {
                setUsers(dataUsers.result);
            } else {
                console.error('Data fetched for users is not an array:', dataUsers);
                setUsers([]); // Définir users comme un tableau vide pour éviter les erreurs lors de l'utilisation de .map()
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="admin-panel">
            <h1>Panel Administrateur - Blog de Pâtisserie</h1>
            <div className="section">
                <h2>Gestion des Recettes</h2>
                {recettes.map(recette => (
                    <div key={recette.id} className="item">
                        <p onClick={() => toggleSelectedRecette(recette)}> {recette.title}</p>
                        {selectedRecette && selectedRecette.id === recette.id && (
                            <div className="details">
                                <p>Description: {selectedRecette.description}</p>
                                <p>Contenu: {selectedRecette.content}</p>
                            </div>
                        )}
                        <div>
                            <button className="update button-panel" onClick={() => updateRecette(recette.id, { title: 'Nouveau titre' })}>Mettre à jour</button>
                            <button className="delete button-panel" onClick={() => deleteRecette(recette.id)}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="section">
                <h2>Gestion des utilisateurs</h2>
                {users.map((user, index) => (
                    <div key={index} className="item">
                        <p onClick={() => toggleSelectedUser(user)}>{user.username}</p>
                        {selectedUser && selectedUser.id === user.id && (
                            <div className="details">
                                <p>Email: {selectedUser.email}</p>
                                <p>Role: {selectedUser.role}</p>
                            </div>
                        )}
                        <div>
                            <button className="update button-panel" onClick={() => changeUserRole(user.id, 'admin')}>Mettre à jour</button>
                            <button className="delete button-panel" onClick={() => deleteUser(user.id)}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel