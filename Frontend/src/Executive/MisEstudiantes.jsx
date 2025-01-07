import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ManageUsers.css';

const MisEstudiantes = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loadingRole, setLoadingRole] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Verificar el rol del usuario
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserRole/${user.email}`);
                    setUserRole(response.data.roleId);
                    setLoadingRole(false);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
        };
        fetchUserRole();
    }, [user]);

    // Obtener todos los estudiantes
    useEffect(() => {
        const fetchUsers = async () => {
            if (!loadingRole && userRole === 1) { // Verificar que sea el ejecutivo
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/users/getStudents`; // Endpoint actualizado
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUsers(response.data);
                    setLoadingUsers(false);
                } catch (error) {
                    console.error('Error fetching students:', error);
                }
            }
        };
        fetchUsers();
    }, [loadingRole, userRole]);

    // Redirigir si no es ejecutivo
    useEffect(() => {
        if (!loadingRole) {
            if (userRole !== 1) { // Verificar si el usuario es ejecutivo
                navigate("/unauthorized");
            }
        }
    }, [loadingRole]);

    const handleSearch = () => {
        // Implementar lógica de búsqueda si es necesario
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loadingUsers) {
        return <LoadingSpinner />;
    }

    return (
        <div className="manage-users-container">
            <Navbar />
            <h1 className="title">Estudiantes</h1>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <div className="users-list-container">
                {filteredUsers.map((user, index) => (
                    <div className="usuario-card" key={index}>
                        <div className="usuario-info">
                            <h3>{user.names} {user.lastName}</h3>
                        </div>
                        <div className="usuario-info">
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div className="actions-container">
                            <div className="action">
                                <Link to={`/SolicitudesDeEstudiantes/${user.email}`}>
                                    <button>Ver Solicitudes</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisEstudiantes;
