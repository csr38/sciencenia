import React from "react";
import Navbar from "../../../Commons/Navbar";
import { useNavigate } from 'react-router-dom';
import '../../../styles/ManageUsers.css';

const NotificarProcesos = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="manage-users-container">
                <h2 className="title">Notificar</h2>
                <div className="button-column">
                    <button onClick={() => navigate('/')}>Solicitudes Aprobadas</button>
                    <button onClick={() => navigate('/')}>Notificar Tutores</button>
                </div>
            </div>
        </div>
    );
}

export default NotificarProcesos;