import { createBrowserRouter } from "react-router-dom"
import Main from "../layout/Main"
import Home from "../pages/home/Home"
import CoursDispenses from "../pages/cours/CoursDispenses"
import Dashboard from "../pages/dashboard/admin/Dashboard"
import DashboardLayout from "../layout/DashBoardLayout"
import LessonSingle from "../pages/cours/LessonSingle"
import Inscription from "../components/Inscription"
import Connexion from "../components/Connexion"
import Contacts from "../pages/contact/Contacts"
import LessonsDashboard from "../pages/dashboard/admin/LessonsDashboard"
import Paiement from "../components/Paiement"
import About from "../components/About"
import ForgotPassword from "../components/ForgotPassword"
import Services from "../components/Services"
import Success from "../components/Sucess"
import Cancel from "../components/Cancel"
import AddLesson from "../pages/dashboard/admin/addLesson"
import LessonUpdateStatut from "../pages/dashboard/admin/LessonUpdateStatut"
import TechnologieUpdateStatut from "../pages/dashboard/admin/TechnologieUpdateStatut"
import Profile from "../components/Profile"
import { AuthProvider } from "../contexts/AuthProvider"
import Users from "../pages/dashboard/admin/CustomersDashboard"
import MessageDetails from "../pages/dashboard/admin/MessageDetails"
import ContactsLayout from "../pages/dashboard/admin/ContactsDashboard"
// import ProtectedRoute from "../PrivateRouter/ProtectedRoute"
// import Cart from "../pages/cart/Cart"
// import LessonDetails from "../pages/dashboard/admin/LessonDetails"
// import MessageDetails from "../pages/contact/MessageDetails"
// import LessonEdit from "../pages/dashboard/admin/LessonEdit"
// import LessonNew from "../pages/dashboard/admin/LessonNew"
// import UserDetails from "../pages/dashboard/admin/UserDetails"



const router = createBrowserRouter([
    {
            path: "/",
            element: <Main />,
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/inscription",
                    element: <Inscription />
                },
                {
                    path: "/connexion",
                    element: <Connexion />
                },
                {
                    path: "/coursdispenses",
                    element: <CoursDispenses />,
                },
                {
                    path: "/lesson/:id",
                    element: <LessonSingle />,
                },
                {
                    path: "/lesson/:id/payment",
                    element: <Paiement />,
                },
                {
                    path: "/contacts",
                    element: <Contacts />
                },
                {
                    path:"/payment",
                    element: <Paiement />
                }, 
                {
                    path: "/about",
                    element: <About />
                },
                {
                    path: "/forgot-password",
                    element: <ForgotPassword />
                },
                {
                    path: "/services",
                    element: <Services />
                },
                {
                    path:"/success",
                    element: <Success />
                },
                {
                    path: "/cancel",
                    element: <Cancel />
                }, 
                {
                    path:"/profile",
                    element: <AuthProvider><Profile /></AuthProvider>

                }
                // {
                //     path: 'contact/:id',
                //     element: <MessageDetails/>
                // }
               

            ], 

        },
        {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
                {
                    path: '',
                    element: <Dashboard />
                },
                {
                    path: 'users',
                    element: <Users />
                },
                {
                    path: 'lessons',
                    element: <LessonsDashboard />
                },
                {
                    path: 'contacts',
                    element: <ContactsLayout/>
                },
                {
                    path: 'contact/:id',
                    element: <MessageDetails/>
                },
                {
                    path : 'changelessonstatut/',
                    element : <LessonUpdateStatut/>
                },
                {
                    path : 'changetechnologiestatut/',
                    element : <TechnologieUpdateStatut/>
                },
                {
                    path: 'addLesson',
                    element: <AddLesson/>
                },
                // {
                //     path: 'addLesson/:id',
                //     element: <LessonModifier/>
                // }
               
            ]
        },
    ])

export default router