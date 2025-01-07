import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Commons/Navbar"; 
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import styles from '../styles/Manage.module.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const EditProfiles = () => {
    const { isLoading, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); 
    const [loadingRole, setLoadingRole] = useState(true); 
    const userRolesDicc = {1:"Ejecutivo", 2:"Estudiante"};
    const navigate = useNavigate(); 

    // Obtener el rol del usuario autenticado
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user && user.email) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserRole/${user.email}`);
                    setUserRole(response.data.roleId);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                } finally {
                    setLoadingRole(false);
                }
            }
        };

        fetchUserRole();
    }, [user]);

    // Obtener todos los usuarios, excluyendo el rol de ejecutivo mismo (opcional, puede cambiar según reglas del negocio)
    useEffect(() => {
        const fetchUsers = async () => {
            if (!isLoading && isAuthenticated) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/users`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const filteredUsers = response.data.filter(user => user.roleId !== 1); // Excluyendo ejecutivos si es necesario
                    setUsers(filteredUsers);
                    setLoading(false);
                    console.log(filteredUsers);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        fetchUsers();
    }, [isLoading, isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        if (!isLoading && !loading && !loadingRole && userRole) {
            if (userRole !== 1) { 
                navigate("/unauthorized");
            }
        }
    }, [isLoading, loading, loadingRole, userRole, navigate]);

    // Lógica para buscar usuarios por email
    const handleSearch = () => {
        // Implementar si es necesario mejorar la búsqueda
    };

    // Filtrar los usuarios por término de búsqueda (email)
    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar la eliminación de usuarios
    const handleDelete = async (email) => {
        const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar este usuario?");
    
        if (confirmDelete) {
          try {
            const accessToken = await getAccessTokenSilently();
          
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/${email}`;
            console.log(url);
            const response = await axios.delete(url, {
               headers: {
                 Authorization: `Bearer ${accessToken}`
               }
             });

            window.location.reload();
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        }
      };

    if (loading || loadingRole) {
        return <LoadingSpinner/>;
    }

    return (
        <div className={styles.manageUsersContainer}>
            <Navbar/>
            <h1 className={styles.title}>Editar Perfiles</h1>
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
                        <div className={styles.usuarioInfo}>
                            <strong>Rol de usuario:</strong> {userRolesDicc[user.roleId]}
                        </div>
                        <div className={styles.usuarioInfo}>
                            <strong>Grado Académico:</strong> {user.academicDegree} 
                        </div>
                        <div className={styles.usuarioInfo}>
                            <strong>Celular:</strong> {user.phoneNumber} 
                        </div>
                        <div className={styles.usuarioInfo}>
                            <strong>Rut:</strong> {user.rut} 
                        </div>
                        <div className={styles.usuarioInfo}>
                            <strong>Investigador asociado:</strong> 
                            {user?.tutors?.length > 0 ? (
                                user.tutors.map((tutor, index) => (
                                <a key={index} href={`/Investigador/${tutor.email}`} className="thesis-link">{tutor.names} {tutor.lastName}</a>
                                ))  
                            ) : (
                                " No informado"
                            )}
                        </div>
                        <div className={styles.actionsContainer}>
                            <button className={styles.buttonAction} onClick={() => navigate(`/EditProfileForm/${user.email}`)}>Editar</button>
                            <button className={styles.buttonAction} onClick={() => navigate(`/ManageThesis/${user.email}`)}>Ver Tesis</button>
                            <button className={styles.buttonAction} onClick={() => handleDelete(user.email)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditProfiles;
