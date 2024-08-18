/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAstronaut, faGaugeHigh, faUserGroup, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { FaRegEdit } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
// import { AuthContext } from '../contexts/AuthProvider'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames';
    
function DashboardLayout() {

    const [content, setContent] = useState()
    const [dash, setDash] = useState()

    useEffect(() => {
        setDash(document.querySelector('#dash'))
    }, []);

     /*By Jules*/
     useEffect(()=> {
        if (dash) {
            const handleDashClick = () =>{
                const content = document.querySelector('#content');
                if (dash) {
                    content.classList.toggle("active")
                }
            }
            // Listener du "click" sur "dash"
            dash.addEventListener("click", handleDashClick)
            return () => {
                dash.removeEventListener('click', handleDashClick)
            }
        }
    }, [dash]);
   

    const OutClasses = classNames({ 
        active: false, //Si le menu burger est deployé et est donc sticky
        none : true,
        burgerSelect: true,
        'p-top-content': true,
        }) 

    //  redirection vers la page d'accueil après connexion
    const location = useLocation()
    const navigate = useNavigate()
    //  redirection vers la page d'accueil après connexion
    const from = location.state?.from?.pathname || '/'

/*By Jules*/


    return (
        <div>
            <div className="drawer-2 drawer-end z-100 burgerSelect">
                <div className="flex center mt-demi mbt-demi">
                    <Link to="/"> 
                        <img src={`${import.meta.env.VITE_LOGO_URL}`} className='width-logo'/> 
                    </Link>
                </div>

                <div className="hidden drawer-side-2 back-blue container burgerSelect">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay-2"></label>

                   
                        {/* Sidebar content here */}
                    <section className="menu-drawer-2 p-4 w-80 min-h-full center">
                        
                        <div className='profile mbt-demi mt-demi'>
                            <Link to="/profile" className='flex mb-3 align-center '>
                                <FontAwesomeIcon icon={faUserAstronaut} style={{ width: '75px', height: '75px', borderRadius: '50%' }} alt="logo" />
                                <span className="badge badge-accent">Admin</span>
                            </Link>

                        </div>

                        <div id="dash">
                            <span className='dashboard-fsize'> Dashboard</span>
                        </div>

                            <div id='content' className={OutClasses} >

                                <div className='mb-1 burgerSelect p-top-content'>
                                    <Link to="/dashboard/users" className='content-fsize'><FontAwesomeIcon icon={faUserGroup} className='mr-2 ' /> Tous les utilisateurs</Link>
                                </div>

                                <div className='mb-1 burgerSelect'>
                                    <Link to="/dashboard/contacts" className='content-fsize'><LiaUserEditSolid className='mr-2  ' /> Messagerie</Link>
                                </div>

                                <div className='mb-1 burgerSelect'>
                                    <Link to="/dashboard/addlesson" className='content-fsize'><LiaUserEditSolid className='mr-2  ' /> Ajouter une leçon</Link>
                                </div>


                                <div className='mb-1 burgerSelect'>
                                    <Link to="/dashboard/changelessonstatut" className='content-fsize'><MdFormatListBulletedAdd className='mr-2 ' /> Changer le statut d'une leçcon</Link>
                                </div>  

                                <div className='mb-1 burgerSelect'>
                                    <Link to="/dashboard/changetechnologiestatut" className='content-fsize' ><FaRegEdit className='mr-2 ' /> Changer le statut d'une technologie</Link>
                                </div>
  

                        </div>      
                              

                        <div className='mb-1 burgerSelect'>
                            <a  className='dashboard-fsize'><FontAwesomeIcon icon={faRightFromBracket} className='mr-2 btn-general' /> Logout</a>
                        </div>
                        
                        <div className='burgerSelect content-fsize' >
                            <Outlet />
                        </div>
                        
                    </section>
                    
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout