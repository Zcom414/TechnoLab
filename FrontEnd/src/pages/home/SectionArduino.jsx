/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import arduino from '/images/arduinoaccueil.webp';

// Définition du composant SectionArduino
const SectionArduino = () => {
    return (
        <div className='py-10 pb-5 services-container'>
            <h1 style={{ color: '#1E3799', textAlign: 'center' }}>TECHNOLAB</h1>
            <article className="section-container">
                <section className="section-arduino">
                    <div className="left">
                        <div className="image-container">
                            <img src={arduino} width={'100%'} height={'100%'} style={{ objectFit: 'cover' }} alt="Photo Arduino" className='image' />
                        </div>
                    </div>
                    <div className="right">
                        <div className="expose">
                            <p>Arduino est une plateforme open-source de prototypage électronique basée sur du matériel et des logiciels faciles à utiliser. Elle est largement utilisée par les amateurs, les étudiants, les enseignants et les professionnels pour créer des projets interactifs.</p>
                            <p><span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur asperiores explicabo, numquam, minima veritatis illo excepturi eum porro ipsum, velit cupiditate. Consequatur ullam quibusdam impedit, aspernatur cumque recusandae sint eius.</span><span>Modi ab eius consequuntur harum totam magni et blanditiis omnis eligendi eveniet, distinctio obcaecati dolores doloremque tempore cum eaque excepturi? Hic explicabo dolorem, velit esse accusamus earum corrupti ut inventore.</span><span>Sequi nesciunt mollitia necessitatibus suscipit? Perferendis laborum dicta excepturi optio ullam soluta facere quidem dolorem dolorum earum dolores necessitatibus, ea tempora voluptates non! Eum sequi iste ratione deserunt incidunt facere.</span></p>
                            
                                <img
                                    className="logo"
                                    src={`${import.meta.env.VITE_LOGO_URL}`}
                                    alt="Logo du site représenté par des chevrons entrelassés avec les pointes en damier" style={{ display: 'block', margin: 'auto' }} 
                                />
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default SectionArduino;