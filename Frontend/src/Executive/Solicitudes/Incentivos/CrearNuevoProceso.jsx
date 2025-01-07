import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../Commons/Navbar';
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/CrearProceso.module.css';  
import { useAuth0 } from "@auth0/auth0-react";

const CrearNuevoProceso = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const [loading, setLoading] = useState(false);
    const [periodTitle, setPeriodTitle] = useState('');
    const [periodDescription, setPeriodDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bachelorsBudget, setBachelorsBudget] = useState(0);
    const [mastersBudget, setMastersBudget] = useState(0);
    const [doctorateBudget, setDoctorateBudget] = useState(0);
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
        if (!isLoading && !loading && !loadingRole && userRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
    
            }
        }
      }, [isLoading, loading, loadingRole, userRole, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que la fecha de término no sea anterior a la fecha de inicio
        if (new Date(endDate) < new Date(startDate)) {
            alert("No puedes seleccionar una fecha de término anterior a la fecha de inicio.");
            return; 
        }

        try {
            const accessToken = await getAccessTokenSilently();
            const totalBudget = {
                BachelorDegree: bachelorsBudget, 
                MasterDegree: mastersBudget,
                Doctorate: doctorateBudget
            }
            const postData = {
                periodTitle,
                periodDescription,
                startDate,
                endDate,
                totalBudget
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/applicationPeriod`, postData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 201) {
                alert('Proceso creado con éxito!');
                setPeriodTitle('');
                setPeriodDescription('');
                setStartDate('');
                setEndDate('');
                
                navigate('/ProcesosPostulacionIncentivos');
            }
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.message}`);
            } else if (error.request) {
                alert('No response received from the server');
            } else {
                alert('Error setting up the request');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.formContainer}>
                <h1>Crear Proceso</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Titulo:</label>
                        <input
                            type="text"
                            value={periodTitle}
                            onChange={e => setPeriodTitle(e.target.value)}
                            placeholder="Ingrese aquí..."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Descripción breve:</label>
                        <input
                            type="text"
                            value={periodDescription}
                            onChange={e => setPeriodDescription(e.target.value)}
                            placeholder="Ingrese aquí..."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha de inicio:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha de cierre:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Presupuesto Licenciaturas:</label>
                        <input
                            type="number"
                            value={bachelorsBudget}
                            min={0}
                            onChange={e => setBachelorsBudget(e.target.value)}
                            placeholder="Ingrese presupuesto..."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Presupuesto Magísters:</label>
                        <input
                            type="number"
                            value={mastersBudget}
                            min={0}
                            onChange={e => setMastersBudget(e.target.value)}
                            placeholder="Ingrese presupuesto..."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Presupuesto Doctorados:</label>
                        <input
                            type="number"
                            value={doctorateBudget}
                            min={0}
                            onChange={e => setDoctorateBudget(e.target.value)}
                            placeholder="Ingrese presupuesto..."
                            required
                        />
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default CrearNuevoProceso;
