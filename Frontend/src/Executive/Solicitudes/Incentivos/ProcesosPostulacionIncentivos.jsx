import React, { useEffect, useState } from 'react';
import Navbar from '../../../Commons/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../styles/ProcesosPostulacionIncentivos.module.css';
import { useAuth0 } from "@auth0/auth0-react";

const ProcesosPostulacionIncentivos = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(false); 
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
        fetchProcesses();
    }, []);

    const fetchProcesses = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/applicationPeriod`);
        setProcesses(response.data);
    };

    const deleteProcess = async (id) => {
        try {
            const accessToken = await getAccessTokenSilently();
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/applicationPeriod/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            alert('Proceso eliminado correctamente.');
            setProcesses(processes.filter(process => process.id !== id));
        } catch (error) {
            alert('No se puede eliminar un proceso si ya tiene solicitudes recibidas');
            console.error('Delete error:', error);
        }
    };

    const handleNotificar = async (id) => {
        try {
            const emails = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/scholarship/pending`, { params: { idPeriod: id } });
            if (emails.data.length > 0) {
                const emailString = emails.data.map(email => `${email.emailStudent},${email.emailTutor}`).join(',');
                const urlMailer = `${import.meta.env.VITE_BACKEND_URL}/email`;
                await axios.post(urlMailer, {
                    email: emailString,
                    subject: "Respuesta solicitud de incentivos pendiente",
                    content: "Uno de tus alumnos hizo una solicitud de incentivos debes aceptarla o rechazarla. Visita el apartado de \"Mis Estudiantes\" y revisa su solicitud.",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.solicitudesContainer}>
            <Navbar />
            <h1 className={styles.solicitudesTitle}>Procesos de Postulación a Becas</h1>
            <button className={styles.createProcessBtn} onClick={() => navigate('/CrearNuevoProceso')}>
                Crear Nuevo Proceso
            </button>
            <div className={styles.processesList}>
                {processes.map(process => (
                    <div key={process.id} className={styles.processCard}>
                        <div className={styles.processInfo}>
                            <strong className={styles.processTitle}>{process.periodTitle}</strong>
                            <p><strong>Descripción:</strong> {process.periodDescription}</p>
                            <p><strong>Estado:</strong> {process.statusApplication}</p>
                            <p><strong>Fecha de inicio:</strong> {new Date(process.startDate).toLocaleDateString()}</p>
                            <p><strong>Fecha de cierre:</strong> {new Date(process.endDate).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={() => navigate(`/ManejarSolicitudesIncentivos/${process.id}`)}>Ver Solicitudes</button>
                            {/* <button onClick={() => handleNotificar(process.id)}>Notificar</button> */}
                            <button onClick={() => navigate(`/EditarProceso/${process.id}`)}>Editar</button>
                            <button onClick={() => deleteProcess(process.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcesosPostulacionIncentivos;
