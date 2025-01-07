import React, { useState, useEffect } from 'react';
import styles from '../../../styles/VerSolicitud.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../../Commons/Navbar";
import LoadingSpinner from "../../../Commons/LoadingSpinner";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const VerSolicitudIncentivos = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    let { id } = useParams();

    const [requests, setRequests] = useState([]);
    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const [amountGranted, setAmountGranted] = useState(0);
    const [requestResponse, setRequestResponse] = useState('');

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
        const fetchRequestData = async () => {
            if (!isLoading && user) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship/${id}`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setScholarship(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching request data:', error);
                    setLoading(false);
                }
            }
        };

        fetchRequestData();
    }, [isLoading, user, getAccessTokenSilently, id]);

    const downloadFile = async (fileId) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/files/${fileId}`;
    
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                },
                responseType: 'json'
            });
    
            if (response.data && response.data.url) {
                window.open(response.data.url, '_blank');
            } else {
                console.error("Error: No file URL found in response");
                alert("Failed to retrieve the file URL. Please try again.");
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("An error occurred while downloading the file. Please try again.");
        }
    };

    useEffect(() => {
        if (!isLoading && !loading && !loadingRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
            }
        }
    }, [isLoading, loading, loadingRole, userRole, navigate]);

    if (isLoading || loading || loadingRole) {
        return <LoadingSpinner />;
    }

    const handleAnswer = async (value) => {
        const accessToken = await getAccessTokenSilently();
        const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship/${id}`;
        const status = value ? "Aprobada" : "Rechazada";
        const updateParams = {
            status, 
            amountGranted,
            response: requestResponse
        }

        try {
            const response = await axios.patch(url, updateParams, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        
            if (response.status === 200) {
                console.log(response);
            } else {
                console.error("Error al cambiar la solicitud:", response);
            }
        } catch (error) {
            console.error("Error al cambiar la solicitud", error);
        }

        navigate(-1);
    }

    const renderButtons = () => {
        if (scholarship.status === "Pendiente") {
            return (
                <div>
                    <div className={styles.dropdownContainer}>
                        <label htmlFor="amountGranted">Elige el monto de la solicitud que vas a aceptar (en caso que aplique):</label>
                        <input
                            type="number"
                            value={amountGranted}
                            min={0}
                            max={scholarship.amountRequested ? scholarship.amountRequested : 0}
                            onChange={(e) => setAmountGranted(e.target.value)}
                            placeholder=""
                        />
                        <label htmlFor="requestResponse">Escribe un motivo para aceptar / rechazar la solicitud:<strong> *</strong></label>
                        <input
                            type="text"
                            value={requestResponse}
                            onChange={(e) => setRequestResponse(e.target.value)}
                            placeholder="Indique motivo..."
                        />
                    </div>
                    <div className={styles.bottonButtonContainer}>
                        <button className={styles.bottonButton} onClick={() => handleAnswer(true)}>Aceptar</button>
                        <button className={styles.bottonButton} onClick={() => handleAnswer(false)}>Rechazar</button>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className={styles.backgroundCard}>
            <Navbar/>
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <button className={styles.profileButton}
                            onClick={() => navigate(`/ManejarSolicitudesIncentivos/${scholarship.applicationPeriod.id}`)}><strong>&lt;</strong>
                    </button>
                    <div className={styles.cardTitle}>
                        <h1>Solicitud de Beca</h1>
                        {scholarship ? (
                            <>
                                <h2 className={styles.sm}>Solicitud #{scholarship.id}</h2>
                                <p className={styles.sm}><strong>Estado:</strong> {scholarship.status}</p>
                                { scholarship.status==='Aceptada' || scholarship.status==='Rechazada' ? (
                                    <p className={styles.sm}>
                                        <strong>Motivo Aceptación / Rechazo: </strong>
                                        {scholarship.response ?? 'No informado'}
                                    </p>
                                ) : (<p></p>)}
                            </>
                        ) : (
                            <p>No se encontró la solicitud.</p>
                        )}
                        <div>
                            <p className={styles.sm}><strong>Nombre periodo a postular:</strong></p>
                            <p className={styles.sm}>{scholarship.applicationPeriod.periodTitle}</p>
                        </div> 
                    </div>
                    <div className={styles.cardTwoCol}>
                        <div>
                            <p className={styles.sm}><strong>Nombre aplicante:</strong></p>
                            <p className={styles.sm}>{scholarship.student.names ?? ''} {scholarship.student.lastName ?? ''}</p>
                        </div> 
                        <div>
                            <p className={styles.sm}><strong>Email aplicante:</strong></p>
                            <p className={styles.sm}>{scholarship.student.email ?? ''}</p>
                        </div>
                    </div>
                    <div className={styles.cardTwoCol}>
                    <div>
                            <p className={styles.sm}><strong>Tutores Asociados:</strong></p>
                            {scholarship.student.tutors && scholarship.student.tutors.length > 0 ? (
                                scholarship.student.tutors.map((tutor, index) => (
                                <div key={index}>
                                    <p className={styles.sm}>{tutor.email} ({tutor.UserResearcher.tutorRol})</p>
                                </div>
                            ))
                            ) : (
                                <p className={styles.sm}>No hay tutores asociados.</p>
                            )}
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Teléfono:</strong></p>
                            <p className={styles.sm}>{scholarship.student.phoneNumber ?? ''}</p>
                        </div>
                    </div>
                    <div className={styles.cardTwoCol}>
                        <div>
                            <p className={styles.sm}><strong>Universidad:</strong></p>
                            <p className={styles.sm}>{scholarship.student.institution ?? ''}</p>
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Participación actividades Cenia:</strong></p>
                            <p className={styles.sm}>{scholarship.ceniaParticipationActivities ?? ''}</p>
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Publicación de paper:</strong></p>
                            <p className={styles.sm}>{scholarship.scientificProduction ?? ''}</p>
                        </div>
                        <div>
                            <p className={styles.sfm}><strong>Monto Solicitado:</strong></p>
                            <p className={styles.sm}>{scholarship.amountRequested ? scholarship.amountRequested : 'No especificado'}</p>
                        </div>
                    </div>
                    <div className="sm">
                                    <strong>Archivo Adjunto:</strong>
                                    {scholarship.files && scholarship.files.length > 0 ? (
                                        <div>
                                            <a 
                                                href="#" 
                                                onClick={() => downloadFile(scholarship.files[0].id)} 
                                                style={{ color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                {scholarship.files[0].fileName}
                                            </a>
                                        </div>
                                    ) : (
                                        <p>No hay archivo adjunto.</p>
                                    )}
                                </div>

                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}

export default VerSolicitudIncentivos;
