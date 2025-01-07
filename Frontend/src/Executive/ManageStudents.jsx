import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Manage.module.css';

const ManageStudents = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loadingRole, setLoadingRole] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        const fetchUsers = async () => {
            if (!loadingRole) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/users`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    console.log(response.data);
                    const filteredUsers = response.data.filter(user => user.roleId === 2);
                    console.log(filteredUsers);
                    setUsers(filteredUsers);
                    setLoadingUsers(false);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };
        fetchUsers();
    }, [loadingRole]);

    useEffect(() => {
        if (!loadingRole) {
            console.log(userRole);
            if (userRole != 1) {
                navigate("/unauthorized");
            }
        }
    }, [loadingRole]);

    const handleSearch = () => {
        // Implementar
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
            <h1 className={styles.title}>Estudiantes</h1>
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
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div className={styles.actionsContainer}>

                            <button className={styles.buttonAction}
                                    onClick={() => navigate(`/ObserveUsers/${user.email}`)}>Ver Perfil
                            </button>
                            <button className={styles.buttonAction}
                                    onClick={() => navigate(`/ManageThesis/${user.email}`)}>Ver Tesis
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

export default ManageStudents;
