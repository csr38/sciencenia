import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Navbar from "../Commons/Navbar";
import styles from '../styles/Anuncio.module.css';
import { useNavigate } from 'react-router-dom';

const CrearAnuncio = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const [userback, setUser] = useState('');
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingRole, setLoadingRole] = useState(true);
    const [targetAudiences, setTargetAudiences] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user && user.email) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserRole/${user.email}`);
                    setUserRole(response.data.roleId);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                } finally {
                    setLoadingRole(false);
                    console.log(userRole);
                }
            } else {
                setLoadingRole(false);
            }
        };

        fetchUserRole();
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoading && user) {
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
             }
         };

         fetchUserData();
    }, [user, isLoading, getAccessTokenSilently]);

    useEffect(() => {
        if (!isLoading && !loading && !loadingRole && userRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
            }
        }
    }, [isLoading, loading, loadingRole, userRole, navigate]);

    const isFormValid = 
    title.trim() !== '' && 
    description.trim() !== '' && 
    targetAudiences.length > 0; // Validación de audiencia seleccionada

    const handleAudienceChange = (audience) => {
        setTargetAudiences((prev) =>
            prev.includes(audience)
                ? prev.filter((item) => item !== audience)
                : [...prev, audience]
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid || isSending) {
            if (targetAudiences.length === 0) {
                setError("Debe seleccionar al menos una audiencia.");
            }
            return;
        }

        setIsSending(true);
        setError(''); // Limpiar el error si la validación pasa
        try {
            // Crear el anuncio 
            const accessToken = await getAccessTokenSilently();
            const announcementurl = `${import.meta.env.VITE_BACKEND_URL}/announcement/`;
            const announcementResponse = await axios.post(
                announcementurl,
                { title: title, description: description, targetAudiences: targetAudiences}, 
                { headers: { 
                    Authorization: `Bearer ${accessToken}` } }
            );
            setLoading(false);

            console.log('Anuncio creado exitosamente:', announcementResponse.data);
            alert('Anuncio creado con éxito!');
            navigate("/ManageAnuncios");

        } catch (error) {
            console.error('Error al crear el anuncio:', error.response?.data || error.message);
            alert('Ocurrió un error al enviar el anuncio.');
            setLoading(false);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.backgroundAnuncio}>
            <Navbar />
            <div className={styles.containerAnuncio}>
                <div className={styles.announcementFormAnuncio}>
                    <button className={styles.profileButton} onClick={() => navigate('/ManageAnuncios')}><strong>&lt;</strong></button>
                    <h3>Anuncio</h3>
                    <div className={styles.targetAudiences}>
                        <label>Enviar a estudiantes con:<span style={{ color: 'red' }}> *</span></label>
                        <div>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="Grado de Doctorado"
                                    onChange={() => handleAudienceChange("Grado de Doctorado")}
                                    checked={targetAudiences.includes("Grado de Doctorado")}
                                />
                                Grado de Doctorado
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="Equivalente a Magister"
                                    onChange={() => handleAudienceChange("Equivalente a Magister")}
                                    checked={targetAudiences.includes("Equivalente a Magister")}
                                />
                                Equivalente a Magister
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value="Grado de Licenciatura o Título Profesional"
                                    onChange={() => handleAudienceChange("Grado de Licenciatura o Título Profesional")}
                                    checked={targetAudiences.includes("Grado de Licenciatura o Título Profesional")}
                                />
                                Grado de Licenciatura o Título Profesional
                            </label>
                        </div>
                        {error && <p style={{color: 'red'}}>{error}</p>} {/* Mostrar el mensaje de error */}
                    </div>
                
                    <div className={styles.subjectAnuncios}>
                        <label>Titulo<span style={{ color: 'red' }}> *</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ingrese aquí le título del anuncio..."
                        />
                    </div>
                    <div className={styles.messageAnuncios}>
                        <label>Descripción:<span style={{ color: 'red' }}> *</span></label>
                        <textarea
                            placeholder="Ingrese aquí la descripción del anuncio..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button
                        className={styles.sendButtonAnuncios}
                        disabled={!isFormValid || isSending}
                        onClick={handleSubmit}
                    >
                        {isSending ? 'Enviando...' : 'Enviar'}
                    </button>
                    </div>
                </div>
            
            </div>
    );
};

export default CrearAnuncio;
