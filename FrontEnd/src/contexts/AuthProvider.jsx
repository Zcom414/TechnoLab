/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Users from '../pages/dashboard/admin/CustomersDashboard';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); //Utilisation de l'autentificateur

export const AuthProvider = ({ children }) => { //Permet la connexion des enfants du auth
    const [customers, setCustomers] = useState(null);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedLastname = localStorage.getItem('lastname');
        const storedFirstname = localStorage.getItem('firstname');
        const storedEmail = localStorage.getItem('email');
        const storedRoles = localStorage.getItem('roles');
        const storedId = localStorage.getItem('userId');

        console.log(storedRoles)

        if (token && storedLastname && storedFirstname && storedEmail && storedRoles && storedId) {
            let parsedRoles = [];
            try {
                parsedRoles = JSON.parse(storedRoles);
                if (!Array.isArray(parsedRoles)) {
                    throw new Error("Les rôles ne sont pas un tableau valide");
                }
            } catch (error) {
                // console.error("Erreur lors de l'analyse des rôles :", error);
                // // Nettoye les données invalides du localStorage pour éviter de futures erreurs
                // localStorage.removeItem('roles');
                // parsedRoles = []; // Définir un tableau vide pour éviter les erreurs dans le console.log ci-dessous
            }
            setCustomers({
                token,
                lastname: storedLastname,
                firstname: storedFirstname,
                email: storedEmail,
                roles: storedRoles,
                id: storedId
            });
            if (storedRoles.includes('2')) {
                setAdmin(true);
            }
        } else if (token) {
            const fetchCustomersData = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const { email, firstname, lastname, roles, userId } = response.data;
                    setCustomers({ email, lastname, firstname, roles, userId });
                    console.log(roles)

                    localStorage.setItem('lastname', lastname);
                    localStorage.setItem('firstname', firstname);
                    localStorage.setItem('email', email);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('roles', JSON.stringify(roles));
                    if (roles && roles.includes('2')) {
                        setAdmin(true);
                    }
                } catch (error) {
                    // console.error("Erreur lors de la récupération des données des clients :", error);
                }
            };
    
            fetchCustomersData();
        }
    }, []);


    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/customers/login`, { email, password });
            if (response.data.success) {
                const { token, firstname, lastname, userId , id_roles} = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('userId', userId);
                localStorage.setItem('roles' , id_roles)

                // Fetch user details using the token
                const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/customer/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const { email: userEmail, roles } = userResponse.data;
                localStorage.setItem('email', userEmail);
                // localStorage.setItem('roles', roles);
    
                setCustomers({ email: userEmail, lastname, firstname, roles, token, id: userId });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            return false;
        }
    };
    const logout = async () => {
        try {
            // Effectue l'appel d'API pour la déconnexion de l'utilisateur
            await axios.post(`${import.meta.env.VITE_API_URL}/customers/logout`);
            
            // Nettoyer le localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('lastname');
            localStorage.removeItem('firstname');
            localStorage.removeItem('email');
            localStorage.removeItem('roles');
            localStorage.removeItem('userId');
            
            // Réinitialiser l'état pour le mettre à jour
            setCustomers(null);
            setAdmin(false);
            
            console.log("Déconnexion réussie");
            return true;
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            return false;
        }
    };

    const isAuthenticated = () => {
        return !!customers;
    };

    return (
        <AuthContext.Provider value={{ customers, login, logout, isAuthenticated, admin }}>
            {children}
        </AuthContext.Provider>
    );
};