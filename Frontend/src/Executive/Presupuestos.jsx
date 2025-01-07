import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from "../Commons/Navbar";
import styles from '../styles/Presupuestos.module.css';
import axios from 'axios';

const Presupuestos = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loadingRole, setLoadingRole] = useState(true);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const { register, formState: { errors } } = useForm();
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [request, setRequest] = useState({
        budgetTitle: '',
        totalBudget: 0,
        fundingBudgetDescription: '',
        startDate: '',
        endDate: ''
    });

    const handleInputChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/budget`;
            const response = await axios.post(url, request, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert('Presupuesto creado con éxito! Ya puedes asignarlo a uno o más estudiantes en las Solicitudes de Recursos.')
        } catch (error) {
            console.error(error);
            alert('Ha ocurrido un error. Por favor, intenta nuevamente más tarde.')
        }
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
        if (!isLoading && !loading && !loadingRole && userRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
            }
        }
    }, [isLoading, loading, loadingRole, userRole, navigate]);


    return (
        <div>
            <Navbar />
            <div className={styles.centralContainer}>
                <h2 className={styles.title}>Crear presupuesto para Solicitudes de Recursos</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup} {...register('title', { required: true })}>
                        <label>Título:</label>
                        <input
                            type="text"
                            name="budgetTitle"
                            placeholder="Ingrese aquí el título del presupuesto..."
                            value={request.budgetTitle}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Monto destinado al presupuesto (CLP):</label>
                        <input
                            type="number"
                            name="totalBudget"
                            placeholder="Ingrese aquí el total del presupuesto..."
                            min={0}
                            value={request.totalBudget}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Descripción:</label>
                        <textarea
                            name="fundingBudgetDescription"
                            placeholder="Ingrese aquí la descripción del presupuesto..."
                            value={request.fundingBudgetDescription}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha de inicio:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={request.startDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Fecha de cierre:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={request.endDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" onClick={handleSubmit}>Crear presupuesto</button>
                </form>
            </div>
        </div>
    );
};

export default Presupuestos;