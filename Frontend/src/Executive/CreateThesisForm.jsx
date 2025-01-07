import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function CreateThesisForm() {

  const { isLoading, user, getAccessTokenSilently } = useAuth0();

  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  let { email } = useParams(); 

  const navigate = useNavigate();

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
    if (email) {
      const fetchUserData = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/${email}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isLoading, user, getAccessTokenSilently]);

  // Cambiamos la validación del rol a sólo ejecutivos (rol 1) o estudiantes (rol 2)
  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 1) {                                      

        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const urlupdate = `${import.meta.env.VITE_BACKEND_URL}/thesis`;
      
      const thesisData = {
        email: email,
        title: data.title,
        grade: data.grade,
        institution: data.institution
      };

      await axios.post(urlupdate, thesisData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      navigate(`/ManageThesis/${email}`);
    } catch (error) {
      console.error('Error creating thesis:', error);
    }
  };

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner/>;
  }

  return (!isLoading && !loading) && (
      <div className={styles.background}>
        <Navbar />
        <div className={styles.editInvestigatorProfileFormContainer}>
          <h2 className={styles.formTitle}>Registrar Tesis</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.infoForm}>
            <div className={styles.formColumnsContainer}>
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">
                    Título de la tesis: {errors.title && <span className={styles.errorMessage}>*Obligatorio</span>}
                  </label>
                  <input type="text" id="title" {...register('title', { required: true })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="grade">
                    Grado académico: {errors.grade && <span className={styles.errorMessage}>*Obligatorio</span>}
                  </label>
                  <input type="text" id="grade" {...register('grade', { required: true })} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="institution">
                    Institución: {errors.institution && <span className={styles.errorMessage}>*Obligatorio</span>}
                  </label>
                  <input type="text" id="institution" {...register('institution', { required: true })} />
                </div>
              </div>
            </div>
            <button type="submit" className={styles.submitButton}>Crear</button>
          </form>
        </div>
      </div>

  );
}

export default CreateThesisForm;
