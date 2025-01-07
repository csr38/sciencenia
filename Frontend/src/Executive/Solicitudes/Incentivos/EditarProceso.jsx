import React, { useEffect, useState } from 'react';
import Navbar from '../../../Commons/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../../styles/CrearProceso.module.css';
import { useAuth0 } from '@auth0/auth0-react';

const EditarProceso = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(false); 
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [process, setProcess] = useState({
        periodDescription: '',
        startDate: '',
        endDate: '',
        statusApplication: '',
        totalBudget: {
            BachelorDegree: '',
            MasterDegree: '',
            Doctorate: ''
        }
    });

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
        const fetchProcess = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/applicationPeriod/${id}`);
                
                // Actualizar el estado general del proceso
                setProcess({
                    periodTitle: response.data.periodTitle,
                    periodDescription: response.data.periodDescription,
                    statusApplication: response.data.statusApplication,
                    startDate: response.data.startDate.slice(0, 10),
                    endDate: response.data.endDate.slice(0, 10),
                    totalBudget: response.data.totalBudget,
                });
    
                setStartDate(response.data.startDate.slice(0, 10));
                setEndDate(response.data.endDate.slice(0, 10));
            } catch (error) {
                console.error('Error fetching process data:', error);
                alert('Error al cargar los datos del proceso');
            }
        };
    
        fetchProcess();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "startDate" || name === "endDate") {
            if (name === "startDate") setStartDate(value);
            if (name === "endDate") setEndDate(value);
        }
    
        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setProcess((prev) => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            setProcess((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (new Date(endDate) < new Date(startDate)) {
            alert("No puedes seleccionar una fecha de término anterior a la fecha de inicio.");
            return; 
        }

        try {
            const accessToken = await getAccessTokenSilently();
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/applicationPeriod/${id}`, process, {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }});
            alert('Proceso actualizado con éxito');
            navigate('/ProcesosPostulacionIncentivos');
        } catch (error) {
            console.error('Error updating process:', error);
            alert('Error al actualizar el proceso');
        }
    };

    return (
        <div className={styles.formContainer}>
            <Navbar />
            <h1>Editar Proceso</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Titulo:</label>
                    <input
                        type="text"
                        name="periodTitle"
                        value={process.periodTitle}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Descripción breve:</label>
                    <input
                        type="text"
                        name="periodDescription"
                        value={process.periodDescription}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Fecha de inicio:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={process.startDate}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Fecha de cierre:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={process.endDate}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Estado:</label>
                    <select name="statusApplication" value={process.statusApplication} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="Abierto">Abierto</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Presupuesto Licenciaturas:</label>
                    <input
                        type="number"
                        name="totalBudget.BachelorDegree"
                        value={process.totalBudget.BachelorDegree}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Presupuesto Masters:</label>
                    <input
                        type="number"
                        name="totalBudget.MasterDegree"
                        value={process.totalBudget.MasterDegree}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Presupuesto Doctorados:</label>
                    <input
                        type="number"
                        name="totalBudget.Doctorate"
                        value={process.totalBudget.Doctorate}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default EditarProceso;
