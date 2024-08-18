/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom'; // Assurez-vous d'importer Link depuis 'react-router-dom'

function Footer() {
    return (
        <footer className="services-container">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>Liens utiles</h3>
                    <ul className="footer-nav">
                        <li>
                            <Link to="/contacts" className="footer-link">Contactez-nous</Link>
                        </li>
                        <li>
                            <Link to="/about" className="footer-link">À propos</Link>
                        </li>
                        <li>
                            <Link to="/conditions-generales-de-vente" className="footer-link">Conditions générales de vente</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Réseaux sociaux</h3>
                    <ul className="footer-nav">
                        <li>
                            <a href="#" className="footer-link">Facebook</a>
                        </li>
                        <li>
                            <a href="#" className="footer-link">Twitter</a>
                        </li>
                        <li>
                            <a href="#" className="footer-link">Instagram</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Liens utiles</h3>
                    <ul className="footer-nav">
                        <li>
                            <a href="#" className="footer-link">FAQ</a>
                        </li>
                        <li>
                            <a href="#" className="footer-link">CGU</a>
                        </li>
                        <li>
                            <a href="#" className="footer-link">CGV</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                {/* la fonction new Date().getFullYear() permet d'afficher l'annee */}
                <p>&copy; {new Date().getFullYear()} TechnoLab. Tous droits réservés.</p>
            </div>
        </footer>
    );
}

export default Footer;