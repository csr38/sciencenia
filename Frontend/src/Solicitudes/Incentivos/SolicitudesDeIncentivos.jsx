import React, { useEffect, useState } from 'react';
import Navbar from '../../Commons/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../../styles/PostulacionIncentivos.module.css';

const SolicitudesDeIncentivos = () => {
    const navigate = useNavigate();
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const [processes, setProcesses] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [activeTab, setActiveTab] = useState("open");

    useEffect(() => {
        if (!isLoading && user) {
            fetchProcesses();
            fetchUserScholarships();
        }
    }, [isLoading, user]);

    const fetchProcesses = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/applicationPeriod`);
            setProcesses(response.data);
        } catch (error) {
            console.error('Error fetching application periods:', error);
        }
    };

    const fetchUserScholarships = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/scholarship`, {
                params: { student: user.email },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setScholarships(response.data.data);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
        }
    };

    const checkScholarshipForPeriod = (periodId) => {
        return scholarships.find(scholarship => scholarship.applicationPeriodId === periodId);
    };

    const isPostulationOpen = (startDate) => {
        return new Date(startDate) <= new Date();
    };

    // Filter processes based on the active tab
    const filteredProcesses = processes.filter(process => 
        activeTab === "open" 
            ? (process.statusApplication === "Abierto" || process.statusApplication === "Activo") && !checkScholarshipForPeriod(process.id)
            : checkScholarshipForPeriod(process.id)
    );

    const handleApply = (processId) => {
        navigate(`/NuevaSolicitudIncentivo/${processId}`);
    };

    const handleViewApplication = (scholarshipId) => {
        navigate(`/VerMiSolicitudDeIncentivo/${scholarshipId}`);
    };

    return (
        <div className={styles.solicitudesContainer}>
            <Navbar/>
            <h1 className={styles.solicitudesTitle}>Procesos de Postulación a Becas</h1>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === "open" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("open")}
                >
                    Procesos Abiertos
                </button>
                <button
                    className={`${styles.tab} ${activeTab === "applied" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("applied")}
                >
                    Aplicaciones Enviadas
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.processesTable}>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Fecha de cierre</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcesses.map(process => {
                            const scholarship = checkScholarshipForPeriod(process.id);
                            return (
                                <tr key={process.id}>
                                    <td>{process.periodDescription}</td>
                                    <td>
                                        <span className={`${styles.statusLabel} ${process.statusApplication === "Abierto" || process.statusApplication === "Activo" ? styles.open : styles.closed}`}>
                                            {process.statusApplication}
                                        </span>
                                    </td>
                                    <td>{new Date(process.endDate).toLocaleDateString("es-ES")}</td>
                                    <td>
                                        <div className={styles.buttonGroup}>
                                            {scholarship ? (
                                                <button onClick={() => handleViewApplication(scholarship.id)}>
                                                    Ver mi solicitud
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={isPostulationOpen(process.startDate) ? () => handleApply(process.id) : null}
                                                    disabled={!isPostulationOpen(process.startDate)}
                                                >
                                                    {isPostulationOpen(process.startDate) ? 'Postular' : 'Postulación aún no inicia'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SolicitudesDeIncentivos;
