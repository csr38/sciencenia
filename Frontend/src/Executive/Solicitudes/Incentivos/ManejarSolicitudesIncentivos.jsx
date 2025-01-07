import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../Commons/Navbar";
import LoadingSpinner from "../../../Commons/LoadingSpinner";
import styles from '../../../styles/ManejoSolicitudesIncentivos.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from 'react-router-dom';

const ManejarSolicitudesIncentivos = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const { id } = useParams();

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);

  
  
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
                    const url = status === '' 
                        ? `${import.meta.env.VITE_BACKEND_URL}/scholarship?applicationPeriodId=${id}` 
                        : `${import.meta.env.VITE_BACKEND_URL}/scholarship/status?statusType=${status}&idPeriod=${id}`;

                    const response = await axios.get(url, {
                        params: { page },
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
    }, [isLoading, isAuthenticated, getAccessTokenSilently, page, status, id]);

    useEffect(() => {
        let filtered;
        if (status === 'Aprobada') {
            filtered = requests.filter(request => 
                request.status.toLowerCase() === 'aprobada' || request.status.toLowerCase() === 'aprobado'
            );
        } else if (status) {
            filtered = requests.filter(request => request.status.toLowerCase() === status.toLowerCase());
        } else {
            filtered = requests;
        }
        setFilteredRequests(filtered);
    }, [status, requests]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setLoading(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar esta solicitud?");
        if (confirmDelete) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/request/${id}`);
                setRequests(requests.filter(request => request.id !== id));
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
            <h1 className={styles.solicitudesTitle}>Solicitudes de Becas del Periodo #{id}</h1>
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
                                    <td>{request.student.names} {request.student.lastName}</td>
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
                                                    <button onClick={() => navigate(`/VerSolicitudIncentivos/${request.id}`)}>
                                                        Ver Solicitud
                                                    </button>
                                                    {/* <button onClick={() => handleDelete(request.id)}>
                                                        Eliminar
                                                    </button> */}
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
            <div className={styles.solicitudesPagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={p === page ? styles.active : ''}
                        disabled={p === page}
                    >
                        {p}
                    </button>
                ))}
            </div>
            {error && <div className={styles.solicitudesError}>{error}</div>}
        </div>
    );
};

export default ManejarSolicitudesIncentivos;
 