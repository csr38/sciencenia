import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../../Commons/Navbar";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import '../../styles/ManejoSolicitudes.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const MisSolicitudes = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [activeTab, setActiveTab] = useState("pendiente");

    const dropdownRefs = useRef([]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!isLoading && isAuthenticated) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/request/${user.email}`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setRequests(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching requests:', error);
                    setLoading(false);
                }
            }
        };
        fetchRequests();
    }, [isLoading, isAuthenticated, getAccessTokenSilently]);
    

    const handleDropdownToggle = (index) => {
        setDropdownVisible(dropdownVisible === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownVisible !== null &&
                dropdownRefs.current[dropdownVisible] &&
                !dropdownRefs.current[dropdownVisible].contains(event.target)
            ) {
                setDropdownVisible(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownVisible]);

    const filteredRequests = requests.filter(request => 
        activeTab === "pendiente" 
            ? request.status.toLowerCase() === "pendiente"
            : request.status.toLowerCase() === "aprobada" || request.status.toLowerCase() === "rechazada"
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="solicitudes-container">
            <Navbar />
            <h1 className="solicitudes-title">Mis solicitudes de recursos</h1>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === "pendiente" ? "active-tab" : ""}`}
                    onClick={() => setActiveTab("pendiente")}
                >
                    Pendientes
                </button>
                <button
                    className={`tab ${activeTab === "finalizada" ? "active-tab" : ""}`}
                    onClick={() => setActiveTab("finalizada")}
                >
                    Finalizadas
                </button>
            </div>

            <div className="table-container">
                <table className="solicitudes-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request, index) => (
                            <tr key={index}>
                                <td>Solicitud #{request.id}</td>
                                <td>{request.purpose || "No especificado"}</td>
                                <td>
                                    <span className={`estado-label ${request.status.toLowerCase().replace("ado", "ada")}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td>
                                    {request.createdAt 
                                        ? new Date(request.createdAt).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: '2-digit' }) 
                                        : "Fecha no disponible"}
                                </td>
                                <td>
                                    <div
                                        className="dropdown-container"
                                        ref={(el) => (dropdownRefs.current[index] = el)}
                                    >
                                        <button
                                            className="dropdown-button"
                                            onClick={() => handleDropdownToggle(index)}
                                        >
                                            &#8230;
                                        </button>
                                        {dropdownVisible === index && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => {
                                                    navigate(`/VerMiSolicitud/${request.id}`);
                                                }}>
                                                    Ver Solicitud
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MisSolicitudes;
