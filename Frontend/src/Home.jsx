import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import Navbar from "./Commons/Navbar";
import LoadingSpinner from "./Commons/LoadingSpinner"; 
import headerBackground from "./assets/Banner.png";
import "./styles/home.css"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import mascota10 from './assets/mascota-10.png'; 
import mascota11 from './assets/mascota-11.png'; 
import mascota12 from './assets/mascota-12.png'; 
import mascota13 from './assets/mascota-13.png'; 
import mascota14 from './assets/mascota-14.png'; 
import sciencenia from './assets/sciencenia.png'; 

function Home() {
    const backgroundStyle = { backgroundImage: `url(${headerBackground})` };
    const url = `${import.meta.env.VITE_BACKEND_URL}/users`;
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [userIdSent, setUserIdSent] = useState(false);
    const [userBack, setUser] = useState(null);
    const [currentMascota, setCurrentMascota] = useState(0); 
    const mascotas = [
        mascota10, mascota11, mascota12, mascota13, mascota14
    ];

    // Alternar entre las imágenes cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMascota(prevMascota => (prevMascota + 1) % mascotas.length); 
        }, 3000); 

        return () => clearInterval(interval); 
    }, []);

    useEffect(() => {
        const sendUserToBackend = async () => {
            if (isAuthenticated && user && !userIdSent) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const userObj = {
                        nickname: user.nickname,
                        email: user.email,
                    };

                    await axios.post(url, userObj, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    console.log('User sent to backend');
                    setUserIdSent(true);
                } catch (error) {
                    console.error('Error al enviar user al backend', error);
                }
            }
        };
        sendUserToBackend();
    }, [isAuthenticated, user, userIdSent, getAccessTokenSilently, useNavigate]);

    useEffect(() => {
        if (userIdSent) {
            const fetchUserData = async () => {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
    
            fetchUserData();
        }
    }, [isLoading, user, getAccessTokenSilently, userIdSent]);

    useEffect(() => {
        if (userBack) {
            const fetchUserData = async () => {
                if (!userBack.names || !userBack.lastName) {
                    navigate('/RegistrarDatos');
                    return;
                }
            };

            fetchUserData();
        }
    }, [isLoading, user, getAccessTokenSilently, userBack]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="background" style={backgroundStyle}>
            <Navbar />
            <div className="content-container">
                <div className="text-and-mascota">
                    <img src={sciencenia} alt="SciEncenia" className="sciencenia-image" />
                    {mascotas.map((mascota, index) => (
                        <img
                            key={index}
                            src={mascota}
                            alt={`Mascota ${index + 1}`}
                            className={`icon ${currentMascota === index ? 'visible' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
