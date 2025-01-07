import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Manage.module.css';

const ManageUsers = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [loadingRole, setLoadingRole] = useState(true);
    const [userRole, setUserRole] = useState(null);

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
        if (!loadingRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");
            }
        }
    }, [loadingRole, userRole, navigate]);

    if (loadingRole) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Navbar />
            <div className={styles.manageUsersContainer}>
                <h2 className={styles.title}>Gestionar Usuarios</h2>
                <div className={styles.buttonColumn}>
                    <button onClick={() => navigate('/UploadStudent')}>Agregar Estudiantes</button>
                    <button onClick={() => navigate('/UploadTutor')}>Agregar Investigadores</button>
                    <button onClick={() => navigate('/EditProfiles')}>Editar Perfiles</button>
                    {/* <button onClick={() => navigate('/ManageStudents')}>Gestionar Estudiantes</button> */}
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;
