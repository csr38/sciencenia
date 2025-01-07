import React from "react";
import Navbar from "../../../Commons/Navbar";
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/Manage.module.css';

const VerSolicitudesEjecutivo = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className={styles.manageUsersContainer}>
                <h2 className={styles.title}>Solicitudes</h2>
                <div className={styles.buttonColumn}>
                    <button onClick={() => navigate('/ManejarSolicitudesFondos')}>Solicitudes de Fondos</button>
                    <button onClick={() => navigate('/SolicitudesDeIncentivos')}>Solicitudes de Incentivos</button>
                </div>
            </div>
        </div>
    );
}

export default VerSolicitudesEjecutivo;