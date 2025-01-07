import React, { useState, useEffect } from 'react';
import styles from '../../../styles/VerSolicitud.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../../Commons/Navbar";
import LoadingSpinner from "../../../Commons/LoadingSpinner";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const VerSolicitudFondos = () => {
    const { isLoading, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    let { id } = useParams();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const [fundingBudgets, setFundingBudgets] = useState([]);
    const [amountGranted, setAmountGranted] = useState(0);
    const [requestResponse, setRequestResponse] = useState('');
    const [fundingBudgetId, setFundingBudgetId] = useState('');

    const [formData, setFormData] = useState({
        applicantFullName: "",
        role: "",
        tutorFullName: "",
        purpose: '',
        otherPurpose: '',
        tasksToDo: '',
        resultingWork: '',
        destination: '',
        startDate: '',
        durationPeriod: '',
        financingType: [],
        otherFinancingType: '',
        outsideFinancing: false,
        outsideFinancingSponsors: '',
        conferenceName: '',
        conferenceRanking: '',
        researchName: '',
        researchAbstract: '',
        acknowledgment: '',
        acknowledgmentProof: '',
        outsideAcknowledgment: '',
        outsideAcknowledgmentName: '',
        participationType: '',
    });

    const formatNumber = (number) => {
        const formattedNumber = new Intl.NumberFormat("es-CL").format(number);
        return `$${formattedNumber} CLP`;
    };

    const getValueOrDefault = (value) => {
        return value ? value : "No aplica";
    };

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
                    const url = `${import.meta.env.VITE_BACKEND_URL}/request/getById/${id}`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setRequest(response.data);
                    setFormData(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching request data:', error);
                    setLoading(false);
                }
            }
        };

        fetchRequestData();
    }, []);

    useEffect(() => {
        const fetchFundingBudgets = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/budget?status=Activo`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.status === 200) {
                    setLoading(false);
                    const budgets = response.data.budgets;
                    setFundingBudgets(budgets);

                    if (budgets.length > 0) {
                        setFundingBudgetId(budgets[0].id);
                    }
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching funding request data:', error);
            }
        };
        fetchFundingBudgets()
    }, []);

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
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/request/${id}`;
            const status = value ? "Aprobada" : "Rechazada";
            let updateParams = {
                status,
                amountGranted,
                response: requestResponse,
            }
            if (value) {
                updateParams = {
                    ...updateParams,
                    budgetId: fundingBudgetId
                }
            }

            const response = await axios.patch(url, updateParams, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            });
            alert('Solicitud actualizada exitosamente!')
            navigate('/ManejarSolicitudesFondos');
        } catch (error) {
            alert('Error al hacer la solicitud: ' + error.response.data.message)
            console.error("Error al cambiar la solicitud:", error);
        }
    };

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

    const renderButtons = () => {
        if (request.status === "Pendiente") {
            return (
                <div>
                    <div className={styles.dropdownContainer}>
                        <label htmlFor="fundingBudget">Elige un presupuesto al cual asignar la solicitud en caso de ser aceptada:</label>
                        <select id="fundingBudget" name="fundingBudgetId" value={fundingBudgetId} onChange={(e) => setFundingBudgetId(e.target.value)}>
                            {fundingBudgets.map((budget) => (
                                <option key={budget.id} value={budget.id}>
                                    {budget.budgetTitle}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="amountGranted">Elige el monto de la solicitud que vas a aceptar (en caso que aplique):</label>
                        <input
                            type="number"
                            value={amountGranted}
                            min={0}
                            max={formData.amountRequested ? formData.amountRequested : 0}
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
    };

    const renderConditionalFields = () => {
        switch (formData.purpose) {
            case "":
                break;
            case 'Asistencia a conferencia':
                return (
                    <div className={styles.smb}>
                    </div>
                );
            case 'Otro':
            default:
                return formData.otherPurpose !== null ? (
                    <div className={styles.smb}>
                        <p className={styles.sm}><strong>Otro motivo:</strong></p>
                        <p className={styles.sm}>{getValueOrDefault(formData.otherPurpose)}</p>
                    </div>
                ) : null;
        }
    };

    return (
        <div className={styles.backgroundCard}>
            <Navbar />
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <button className={styles.profileButton} onClick={() => navigate('/ManejarSolicitudesFondos')}><strong>&lt;</strong></button>
                    <div className={styles.cardTitle}>
                        <h1>Solicitud de Recursos para viajes</h1>
                        {request ? (
                            <>
                                <h2 className={styles.sm}>Solicitud #{request.id}</h2>
                                <p className={styles.sm}><strong>Estado:</strong> {getValueOrDefault(request.status)}</p>
                                {request.status==='Aprobada' || request.status==='Rechazada' ? (
                                    <p className={styles.sm}>
                                        <strong>Motivo Rechazo / Aceptación: </strong>
                                        {request.response}
                                    </p>
                                ) : (
                                    <p></p>
                                )
                                }
                            </>
                        ) : (
                            <p>No se encontró la solicitud.</p>
                        )}
                    </div>
                    <div className={styles.cardTwoCol}>
                        <div>
                            <p className={styles.sm}><strong>Nombre aplicante:</strong></p>
                            <p className={styles.sm}>{getValueOrDefault(formData.applicant.names)} {getValueOrDefault(formData.applicant.lastName)}</p>
                        </div>
                        <div>
                            <p className={styles.sfm}><strong>Financiamiento Solicitado:</strong></p>
                            <p className={styles.sm}>{formData.financingType.length > 0 ? formData.financingType.join(", ") : "No aplica"}</p>
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Destino:</strong></p>
                            <p className={styles.sm}>{getValueOrDefault(formData.destination)}</p>
                        </div>
                        <div>
                            <p className={styles.sfm}><strong>Monto Solicitado:</strong></p>
                            <p className={styles.sm}>{formData.amountRequested ? formatNumber(formData.amountRequested) : "No informado"}</p>
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Duración del Periodo:</strong></p>
                            <p className={styles.sm}>{getValueOrDefault(formData.durationPeriod)}</p>
                        </div>
                        <div>
                            <p className={styles.sfm}><strong>Monto Aprobado:</strong></p>
                            <p>{formData.amountGranted ? formatNumber(formData.amountGranted) : "Solicitud aún no procesada o rechazada"}</p>
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Motivo:</strong></p>
                            <p className={styles.sm}>{getValueOrDefault(formData.purpose)}</p>
                        </div>
                        <div>
                            <p className={styles.sm}><strong>Fecha de Inicio:</strong></p>
                            <p className={styles.sm}>{new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(formData.startDate))}</p>
                        </div>
                    </div>
                    <div className={styles.cardTwoCol}>
                        <div className={styles.sm}>
                            <p><strong>Nombre de la conferencia:</strong></p>
                            <p>{getValueOrDefault(formData.conferenceName)}</p>
                        </div>
                        <div className={styles.sm}>
                            <p><strong>Ranking de la conferencia:</strong></p>
                            <p>{getValueOrDefault(formData.conferenceRanking)}</p>
                        </div>
                        <div className={styles.sm}>
                            <p><strong>Título del paper:</strong></p>
                            <p>{getValueOrDefault(formData.researchName)}</p>
                        </div>
                        <div className={styles.sm}>
                            <p><strong>Abstract:</strong></p>
                            <p>{getValueOrDefault(formData.researchAbstract)}</p>
                        </div>
                        <div className={styles.sm}>
                            <p><strong>Cenia acknowledgment:</strong></p>
                            <p>{getValueOrDefault(formData.acknowledgment)}</p>
                        </div>
                        <div className="smb">
                            <p className="sm"><strong>Financiamiento externo:</strong></p>
                            <p className="sm">{getValueOrDefault(formData.outsideFinancingSponsors)}</p>
                        </div>
                        <div className={styles.sm}>
                            <p><strong>Acknowledgment de otros institutos:</strong></p>
                            <p>{formData.outsideAcknowledgment ? "Sí" : "No"}</p>
                        </div>
                        <div className={styles.sm}>
                            <p><strong>Tipo de participación:</strong></p>
                            <p>{getValueOrDefault(formData.participationType)}</p>
                        </div>
                        <div className="smb">
                            <p className="sm"><strong>Archivo Adjunto:</strong></p>
                            {request?.files && request.files.length > 0 ? (
                                <span
                                    onClick={() => downloadFile(request.files[0].id)}
                                    style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    {getValueOrDefault(request.files[0].fileName)}
                                </span>
                            ) : (
                                <p>No hay archivo adjunto.</p>
                            )}
                        </div>
                    </div>
                    {renderConditionalFields()}
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}

export default VerSolicitudFondos;
