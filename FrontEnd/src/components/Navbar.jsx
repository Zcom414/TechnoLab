/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBars, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classNames from "classnames"

function NavBar() {
    const { isAuthenticated, logout, customers } = useAuth();
    const [lessons, setLessons] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [isSticky, setIsSticky] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [icons, setIcons] = useState()


    useEffect(() => {
        setIcons(document.querySelector("#icons"))

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        const loadLessonsFromLocalStorage = () => {
            const savedLessons = JSON.parse(localStorage.getItem('cart')) || {};
            setLessons(savedLessons);
        };

        loadLessonsFromLocalStorage();

        const interval = setInterval(loadLessonsFromLocalStorage, 500);

        return () => clearInterval(interval);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        const result = await logout();
        if (result) {
            alert('Vous êtes déconnecté');
            navigate(from, { replace: true });
        } else {
            alert('Erreur lors de la déconnexion');
        }
    };
    /*By Jules*/
    useEffect(()=> {
        if (icons) {
            const handleIconsClick = () =>{
                const nav = document.querySelector('#nav');
                if (nav) {
                    nav.classList.toggle("active")
                }
            }
            // Listener du "click" sur "icons"
            icons.addEventListener("click", handleIconsClick)
            return () => {
                icons.removeEventListener('click', handleIconsClick)
            }
        }
    }, [icons]);

    const navClasses = classNames({

        'main-nav-outer': true, //Si le menu burger est deployé et est donc sticky
        active : !isSticky, //false + false = true
        'transition-duration-300': isSticky, //true - false = true
        })

        const isAdmin = customers && customers.roles && customers.roles.includes('2');

    // let isAdmin = false 
    //     if (customers && customers.roles && customers.roles.includes('2')){
    //         isAdmin = true
    //     }



    return (
        <header id='header' className='main-nav-outer'>
           
                    <div className="mobile-header">
                        <div className='small-logo'>
                        <NavLink to="/" >
                            <img 
                                className="logo" 
                                 src={`${import.meta.env.VITE_LOGO_URL}`} 
                                 alt="Logo du site" 
                                 />
                        </NavLink> 
                        <div id='icons'></div>
                        </div>
                    </div>

                    <nav nav={navClasses}>

                        <div className="container"> 

                    <ul id="nav" className='main-nav'>
                        <li><NavLink to="/" exact="true" activeclassname="active">Accueil</NavLink></li>
                        <li><NavLink to="/services" activeclassname="active">Services</NavLink></li>
                        <li><NavLink to="/coursdispenses" activeclassname="active">Cours dispensés</NavLink></li>

                        {isAuthenticated() && isAdmin && (
                            <li><NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink></li>
                        )}
                        
                        {/* <li><NavLink to="/"><img src={`${import.meta.env.VITE_LOGO_URL}`} alt="Logo du site" className="logo" /></NavLink></li> */}
                        {!isAuthenticated() && (
                            <>
                                <li><NavLink to="/inscription" activeclassname="active" exact="true">S'inscrire</NavLink></li>
                                <li><NavLink to="/connexion" activeclassname="active" exact="true">Connexion</NavLink></li>
                            </>
                        )}
                        <li><NavLink to="/payment" activeclassname="active" exact="true">
                            <FontAwesomeIcon icon={faCartShopping} />({Object.keys(lessons).length})</NavLink>
                        </li>
                        {isAuthenticated() && customers && (
                            <li>
                                <div className="profile-info">
                                    <NavLink to="/profile" className="flex align-center">
                                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                                        <span>Bienvenue</span>
                                        <span>{customers.lastname} 👋!</span>
                                    </NavLink>

                                    <button
                                        className='color7'
                                        style={{
                                            borderRadius: '5px',
                                            padding: '0.2rem',
                                            marginLeft: '1rem',
                                            cursor: 'pointer',
                                            backgroundColor: isHovered ? '#fff' : '#e55039',
                                            color: isHovered ? '#e55039' : '#fff',
                                            border: '1px solid #e55039',
                                            transition: 'background-color 0.3s, color 0.5s',
                                        }}
                                        onClick={handleLogout}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul> 
                </div>
            </nav>
        </header>
    );
}

export default NavBar;