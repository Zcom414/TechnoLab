/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

function Services() {
    return (
        <div className="services-container">
            <header className="services-header">
                <h2 style={{color: '#ffffff', textTransform: 'uppercase'}}>Nos Services</h2>
            </header>
            {/*  <div className="header flex justify-between align-center">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3799' }}><img src={import.meta.env.VITE_LOGO_URL} alt="logo" style={{ width: '2rem', height: '2rem' }}/> TechnoLab</h1>
                <p onClick={() => navigate('/connexion')}><FontAwesomeIcon icon={faCircleUser} size='2xl' style={{ color: '#1e3799', cursor: 'pointer' }} /> Merci de bien vouloir vous identifier SVP</p>
            </div> */}
            <section className="services-content">
                <h2>Formation en Arduino</h2>
                <p>
                    Nous offrons une formation complète en Arduino, vous permettant de maîtriser cette plateforme et de réaliser vos propres projets électroniques. Que vous soyez débutant ou expérimenté, notre formation s'adapte à votre niveau.
                </p>
                <h2>Ateliers Raspberry Pi</h2>
                <p>
                    Participez à nos ateliers Raspberry Pi pour apprendre à utiliser ce mini-ordinateur polyvalent. Découvrez comment l'intégrer dans vos projets de domotique, de robotique et bien plus encore.
                </p>
                <h2>Programmation en C++ et Python</h2>
                <p>
                    Améliorez vos compétences en programmation avec nos cours de C++ et Python. Apprenez à écrire des scripts efficaces et à développer des applications robustes.
                </p>
                <h2>Conception de Circuits Imprimés (PCB)</h2>
                <p>
                    Apprenez à concevoir et à fabriquer vos propres circuits imprimés. Nos cours couvrent les logiciels de conception, le prototypage et la fabrication de PCB.
                </p>
                <h2>Impression 3D</h2>
                <p>
                    Découvrez le monde de l'impression 3D avec nos ateliers pratiques. Apprenez à concevoir des modèles 3D et à les imprimer avec précision.
                </p>
                <h2>Intelligence Artificielle (IA) et Machine Learning</h2>
                <p>
                    Plongez dans l'univers de l'IA et du Machine Learning avec nos formations spécialisées. Apprenez à développer des modèles d'apprentissage automatique et à les intégrer dans vos projets.
                </p>
                <h2>Support et Assistance</h2>
                <p>
                    Nous offrons un support continu et une assistance personnalisée pour tous vos projets. Nos experts sont là pour vous aider à chaque étape de votre parcours.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac eros nisi. Aenean fringilla velit ut tortor efficitur, vitae tincidunt mi feugiat. Sed in urna in metus placerat vestibulum. Donec vehicula leo nec lacus vestibulum, in scelerisque risus fermentum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim ac. In at libero sed nunc venenatis imperdiet sed ornare turpis. Donec vitae dui eget tellus gravida venenatis. Integer fringilla congue eros non fermentum. Sed dapibus pulvinar nibh tempor porta.
                </p>
            </section>
            <button className="color20 btn flex"><Link to="/coursdispenses" style={{color: '#ffffff', textDecoration: 'none'}}>Voir plus de services</Link></button>
        </div>
    );
}

export default Services;
