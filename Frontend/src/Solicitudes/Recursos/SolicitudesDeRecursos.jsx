import React from "react";
import Navbar from "../../Commons/Navbar";
import { useNavigate } from 'react-router-dom';
import '../../styles/ManageUsers.css';

const SolicitudesDeRecursos = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="manage-users-container">
                <h2 className="title">Solicitudes De Recursos para Viajes</h2>
                <div className="button-column">
                    <button onClick={() => navigate('/MisSolicitudes')}>Mis Solicitudes</button>
                    <button onClick={() => navigate('/NuevaSolicitud')}>Nueva Solicitud</button>
                </div>
            </div>
        </div>
    );
}

export default SolicitudesDeRecursos;
