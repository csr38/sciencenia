import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar";
import styles from '../styles/Budgets.module.css';

const VerPresupuestos = () => {
    const [budgets, setBudgets] = useState([]);
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [loadingRole, setLoadingRole] = useState(true);

    const formatNumber = (number) => {
        const formattedNumber = new Intl.NumberFormat("es-CL").format(number);
        return `$${formattedNumber} CLP`;
    };

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const url = `${import.meta.env.VITE_BACKEND_URL}/budget`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setBudgets(response.data.budgets);
                setLoading(false);
                setLoadingRole(false);

            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        fetchBudgets();
    }, []);

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
    }, []);

    useEffect(() => {
        if (!loading && !loadingRole && userRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
            }
        }
    }, [loading, loadingRole, userRole, navigate]);

    return (!loading) && (
        <div className={styles.budgetsContainer}>
            <Navbar />
            <h1>Ver Presupuestos actuales</h1>
            <div className={styles.budgetsGrid}>
                {budgets.map((budget) => (
                    <div key={budget.id} className={styles.budgetCard}>
                        <h2>Título: {budget.budgetTitle ?? 'No informado'}</h2>
                        <p>Descripción: {budget.fundingBudgetDescription ?? 'No informado'}</p>
                        <p>Estado: {budget.status ?? 'No informado'}</p>
                        <p>Presupuesto inicial: {formatNumber(budget.totalBudget)}</p>
                        <p>Total usado: {formatNumber(budget.usedBudget)}</p>
                        <p className={styles.special}>
                            Monto disponible: {formatNumber(budget.totalBudget - budget.usedBudget)}
                        </p>
                        <p>Fecha inicio: {new Date(budget.startDate).toLocaleString()}</p>
                        <p>Fecha término: {new Date(budget.endDate).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerPresupuestos;