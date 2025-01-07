import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Navbar from "../Commons/Navbar";
import styles from '../styles/Anuncio.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const EditarAnuncio = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const [userback, setUser] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingRole, setLoadingRole] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchAnnouncementData = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const announcementUrl = `${import.meta.env.VITE_BACKEND_URL}/announcement/${id}`;
                const response = await axios.get(announcementUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const { title, description } = response.data;
                setTitle(title);
                setDescription(description);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcement data:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchAnnouncementData();
        }
    }, [id, getAccessTokenSilently]);

    const isFormValid = title.trim() !== '' && description.trim() !== '';

    const handleSubmit = async () => {
        if (!isFormValid || isSending) return;

        setIsSending(true);
        try {
            const accessToken = await getAccessTokenSilently();
            const announcementUrl = `${import.meta.env.VITE_BACKEND_URL}/announcement/${id}`;
            const announcementResponse = await axios.patch(
                announcementUrl,
                { title, description },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            console.log('Anuncio editado exitosamente:', announcementResponse.data);
            alert('Anuncio editado con éxito!');
            navigate('/ManageAnuncios');
        } catch (error) {
            console.error('Error al editar el anuncio:', error.response?.data || error.message);
            alert('Ocurrió un error al editar el anuncio.');
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
                    <h3>Edite el anuncio</h3>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <>
                            <div className={styles.subjectAnuncios}>
                                <label>Titulo:</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ingrese aquí el título del anuncio..."
                                />
                            </div>
                            <div className={styles.messageAnuncios}>
                                <label>Descripción:</label>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditarAnuncio;
