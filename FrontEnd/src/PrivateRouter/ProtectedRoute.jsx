/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, customers } = useAuth();
    const isAdmin = customers && customers.roles && customers.roles.includes('2');

    return (
        <Route
            {...rest}
            element={isAuthenticated() && isAdmin ? <Component {...rest} /> : <Navigate to="/connexion" />}
        />
    );
};

export default ProtectedRoute;
