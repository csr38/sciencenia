import React, { useState, useEffect } from 'react';
import styles from '../styles/ManageThesis.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../Commons/Navbar"; 
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ManageThesis = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  let { email } = useParams(); 

  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

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
      } else {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const fetchThesisData = async () => {
      if (!isLoading && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/thesis/${email}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setThesis(response.data);
          console.log(response.data)
          setLoading(false);
        } catch (error) {
          console.error('Error fetching thesis data:', error);
          setLoading(false);
        }
      }
    };

    fetchThesisData();
  }, [isLoading, user, getAccessTokenSilently]);

  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 1) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar esta tesis?");

    if (confirmDelete && thesis) {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/thesis/${thesis.id}`;
        const response = await axios.delete(url, {
          headers: {
             Authorization: `Bearer ${accessToken}`
          }
        });

        window.location.reload();
      } catch (error) {
        console.error('Error deleting thesis:', error);
      }
    }
  };

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner/>;
  }

  if (!thesis) {
    return (
        <div className={styles.background}>
          <Navbar/>
          <div className={styles.bigContainer}>
            <div className={styles.container}>
              <div className={styles.infoContainer}>
                <button className={styles.profileButton} onClick={() => navigate('/EditProfiles')}>Volver</button>

                <div className={styles.dataContainer}>
                  <h2>El estudiante no tiene una tesis registrada</h2>
                  {/* <button className={styles.bottonButton}
                          onClick={() => navigate(`/CreateThesisForm/${email}`)}>Registrar Tesis
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  } else {
    return (
        <div className={styles.background}>
          <Navbar/>
          <div className={styles.bigContainer}>
            <div className={styles.container}>
              <div className={styles.infoContainer}>
                <button className={styles.profileButton} onClick={() => navigate('/EditProfiles')}>Volver</button>

                <div className={styles.dataContainer}>
                  <h2>{thesis.title}</h2>

                  <p><strong>Autor:</strong> {thesis.user.names} {thesis.user.lastName}</p> 
                  <p><strong>Estado:</strong> {thesis.status}</p>
                  <p><strong>Fecha de inicio:</strong> {new Date(thesis.startDate).toLocaleDateString()}</p>
                  <p><strong>Fecha de fin:</strong> {new Date(thesis.endDate).toLocaleDateString()}</p>
                  <p><strong>Extensión:</strong> {thesis.extension ? "Sí" : "No"}</p>
                  <p><strong>Recursos solicitados:</strong> {thesis.resourcesRequested ? "Sí" : "No"}</p>
                </div>
                <div className={styles.bottonButtonContainer}>
                  <button className={styles.bottonButton} onClick={() => navigate(`/EditThesisForm/${email}`)}>Editar
                  </button>
                  <button className={styles.bottonButton} onClick={handleDelete}>Eliminar</button>
                </div>
              </div>

            </div>
          </div>
        </div>
    );
  }
}

export default ManageThesis;
