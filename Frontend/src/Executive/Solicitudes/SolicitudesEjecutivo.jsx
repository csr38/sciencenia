import React from "react";
import Navbar from "../../Commons/Navbar";
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/SolicitudesEjecutivo.module.css';

const SolicitudesEjecutivo = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className={styles.manageUsersContainer}>
                <h2 className={styles.title}>Solicitudes</h2>
                <div className={styles.buttonColumn}>
                    <button onClick={() => navigate('/ManejarSolicitudesFondos')}>Solicitudes de Recursos para Viajes</button>
                    <button onClick={() => navigate('/ProcesosPostulacionIncentivos')}>Solicitudes de Becas</button>
                </div>
            </div>
        </div>
    );
}

export default SolicitudesEjecutivo;
