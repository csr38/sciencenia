import React, { useState, useEffect } from 'react';
import styles from '../styles/StudentProfile.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../Commons/Navbar"; 
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ObserveUsers = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  let { email } = useParams(); 

  const [student, setStudent] = useState(null);
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
    const fetchStudentData = async () => {
      if (!isLoading && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/${email}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          console.log(response.data);
          setStudent(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student data:', error);
          setLoading(false);
        }
      }
    };

    fetchStudentData();
  }, [isLoading, user, getAccessTokenSilently, email]);

  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      // Verificación ajustada para permitir solo a Ejecutivos (rol 1) acceder
      if (userRole !== 1) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner />;
  }

  if (student) {
    return (

      <div className={styles.background}>
        <Navbar />
        <div className={styles.bigContainer}>
          <div className={styles.container}>
            <div className={styles.infoContainer}>
              <button className={styles.profileButton} onClick={() => navigate(-1)}>Volver</button>
              <div className={styles.dataContainer}>
                <h2>{student.names} {student.lastName} {student.secondLastName === "No informado" ? "" : student.secondLastName}</h2>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>RUT:</strong> {student.rut}</p>
                <p><strong>Género:</strong> {student.gender}</p>
                <p><strong>Teléfono:</strong> {student.phoneNumber}</p>
                <p><strong>Grado:</strong> {student.grade}</p>
                <p><strong>Líneas de investigación:</strong> {student.researchLines ? student.researchLines.join(', ') : ""}</p>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ObserveUsers;
