import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../Commons/Navbar";
import LoadingSpinner from "../../../Commons/LoadingSpinner";
import styles from '../../../styles/ManejoSolicitudesFondos.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const ManejarSolicitudesFondos = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const [status, setStatus] = useState('');


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
        if (!isLoading && !loading && !loadingRole && userRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
            }
        }
    }, [isLoading, loading, loadingRole, userRole, navigate]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!isLoading && isAuthenticated) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/request`;

                    const response = await axios.get(url, {
                        params: { page: page },
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    setTotalPages(response.data.pages);
                    setRequests(response.data.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching requests:', error);
                    setLoading(false);
                }
            }
        };

        fetchRequests();
    }, [isLoading, isAuthenticated, getAccessTokenSilently, page]);

    useEffect(() => {
        let newFilteredRequests;
        if (status === 'Aprobada') {
            newFilteredRequests = requests.filter(request =>
                request.status.toLowerCase() === 'aprobado' || request.status.toLowerCase() === 'aprobada'
            );
        } else if (status) {
            newFilteredRequests = requests.filter(request => request.status.toLowerCase() === status.toLowerCase());
        } else {
            newFilteredRequests = requests;
        }
        setFilteredRequests(newFilteredRequests);
    }, [status, requests]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setLoading(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar esta solicitud?");
        if (confirmDelete) {
            try {
                const accessToken = await getAccessTokenSilently();
                const url = `${import.meta.env.VITE_BACKEND_URL}/request/${id}`;
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                window.location.reload();
            } catch (error) {
                console.error('Error deleting request:', error);
            }
        }
    };

    const toggleDropdown = (index) => {
        setDropdownVisible(dropdownVisible === index ? null : index);
    };

    if (loading) {
        return <LoadingSpinner />;
    }


    return (
        <div className={styles.solicitudesContainer}>
            <Navbar />
            <h1 className={styles.solicitudesTitle}>Solicitudes de Recursos</h1>
            <div className={styles.buttonRow}>
                <button onClick={() => setStatus('')}>Todas</button>
                <button onClick={() => setStatus('Pendiente')}>Pendientes</button>
                <button onClick={() => setStatus('Aprobada')}>Aprobadas</button>
                <button onClick={() => setStatus('Rechazada')}>Rechazadas</button>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.solicitudesTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Motivo</th>
                            <th>Solicitante</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request, index) => {
                            const normalizedStatus = request.status.toLowerCase().trim();
                            const statusClass = normalizedStatus === 'aprobado' || normalizedStatus === 'aprobada'
                                ? 'aprobada'
                                : normalizedStatus;

                            return (
                                <tr key={index}>
                                    <td>Solicitud #{request.id}</td>
                                    <td>{request.purpose || "No especificado"}</td>
                                    <td>{request.applicant ? request.applicant.names : "Sin solicitante"}</td>
                                    <td>
                                        <span className={`${styles.statusLabel} ${styles[statusClass]}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.dropdownContainer}>
                                            <button className={styles.dropdownButton} onClick={() => toggleDropdown(index)}>
                                                &#8230;
                                            </button>
                                            {dropdownVisible === index && (
                                                <div className={styles.dropdownMenu}>
                                                    <button onClick={() => navigate(`/VerSolicitudFondos/${request.id}`)}>
                                                        Ver Solicitud
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Anterior
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={page === index + 1 ? styles.active : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Siguiente
                </button>
            </div>
            {error && <div className={styles.solicitudesError}>{error}</div>}
        </div>
    );
};

export default ManejarSolicitudesFondos;
