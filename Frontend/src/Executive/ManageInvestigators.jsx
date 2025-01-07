import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Manage.module.css';

const ManageInvestigators = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loadingRole, setLoadingRole] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Obtener el rol del usuario autenticado
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserRole/${user.email}`);
                    setUserRole(response.data.roleId); // Guardar rol del usuario
                    setLoadingRole(false);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
        };
        fetchUserRole();
    }, [user]);

    // Filtrar usuarios - ya no se filtra por `roleId === 4` ya que los investigadores no son un rol explícito
    useEffect(() => {
        const fetchUsers = async () => {
            if (!loadingRole) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/users`; // Obtener todos los usuarios
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUsers(response.data); // Se eliminó el filtro de `roleId === 4`
                    setLoadingUsers(false);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };
        fetchUsers();
    }, [loadingRole]);

    // Verificar si el usuario tiene rol de Ejecutivo (roleId === 1)
    useEffect(() => {
        if (!loadingRole) {
            if (userRole !== 1) { // Solo Ejecutivos pueden acceder
                navigate("/unauthorized");
            }
        }
    }, [loadingRole]);

    const handleSearch = () => {
        // Implementar búsqueda
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loadingUsers) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.manageUsersContainer}>
            <Navbar/>
            <h1 className={styles.title}>Usuarios</h1> {/* Título modificado */}
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <div className={styles.usersListContainer}>
                {filteredUsers.map((user, index) => (
                    <div className={styles.usuarioCard} key={index}>
                        <div className={styles.usuarioInfo}>
                            <h3>{user.names} {user.lastName}</h3>
                        </div>
                        <div className={styles.usuarioInfo}>
                            <strong>Grado:</strong> {user.grade}
                        </div>
                        <div className={styles.usuarioInfo}>
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div className={styles.actionsContainer}>
                            <button className={styles.buttonAction}
                                    onClick={() => navigate(`/ObserveUsers/${user.email}`)}>Ver Perfil
                            </button>
                            <button className={styles.buttonAction}
                                    onClick={() => navigate(`/ManagePublications/${user.email}`)}>Publicaciones
                            </button>
                            <button className={styles.buttonAction}
                                    onClick={() => navigate(`/EditProfileForm/${user.email}`)}>Editar Perfil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageInvestigators;
