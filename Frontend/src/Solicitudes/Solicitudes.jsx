import React from "react";
import Navbar from "../Commons/Navbar";
import { useNavigate } from 'react-router-dom';
import '../styles/ManageUsers.css';

const Solicitudes = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="manage-users-container">
                <h2 className="title">Solicitudes</h2>
                <div className="button-column">
                    <button onClick={() => navigate('/SolicitudesDeRecursos')}>Solicitudes de Recursos para Viajes</button>
                    <button onClick={() => navigate('/SolicitudesDeIncentivos')}>Solicitudes de Becas</button>
                </div>
            </div>
        </div>
    );
}

export default Solicitudes;