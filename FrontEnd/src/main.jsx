/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/Router.jsx'
import './assets/scss/index.scss'
import { AuthProvider } from './contexts/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>

)


