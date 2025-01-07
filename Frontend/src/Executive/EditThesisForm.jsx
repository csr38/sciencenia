import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function EditThesisForm() {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  let { email } = useParams(); 
  const navigate = useNavigate();

  // Con esto accedo al rol del usuario al que entre a editar
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

  //Solicitud para acceder a toda la información de la tesis del usuario
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

          setLoading(false);
        } catch (error) {
          console.error('Error fetching thesis data:', error);
          setLoading(false);
        }
      }
    };
    fetchThesisData();
  }, [isLoading, user, getAccessTokenSilently]);

  //Con esto se si la persona que ingreso tiene acceso o no a esta vista
  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 1) {     //si no es ejecutivo, no tiene acceso                                 

        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  //cuando apreto el boton editar, me realiza la solicitud de patch
  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const urlUpdate = `${import.meta.env.VITE_BACKEND_URL}/thesis/${thesis.id}`;
      
      const thesisData = {
        title: data.title,
        status: data.status, // Opciones: Pendiente, Aprobada, Rechazada
        endDate: data.end_time, // Ejemplo: "2000-01-01T00:00:02.000Z"
        extension: data.extension === "true", // true or false (boolean)
        resourcesRequested: data.resourcesRequested === "true", // true or false (boolean)
      };

      await axios.patch(urlUpdate, thesisData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      navigate(`/ManageThesis/${email}`);
    } catch (error) {
      console.error('Error updating thesis:', error);
    }
  };

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner />;
  }

  return (!isLoading && !loading) && (
    <div className={styles.background}>
      <Navbar />
      <div className={styles.editInvestigatorProfileFormContainer}>
        <h2 className={styles.formTitle}>Editar Tesis</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.infoForm}>
          <div className={styles.formColumnsContainer}>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="title">
                  Título: {errors.title && <span className={styles.errorMessage}></span>}<span style={{ color: 'red' }}> *</span>
                </label>
                <input type="text" id="title" {...register('title', { required: true })}
                       defaultValue={thesis?.title ?? ""} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status">
                  Estado: {errors.status && <span className={styles.errorMessage}></span>}<span style={{ color: 'red' }}> *</span>
                </label>
                <select id="status" {...register('status', { required: true })} defaultValue={thesis?.status ?? ""} required>
                  <option value="">Seleccione...</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="extension">
                  Extensión:<span style={{ color: 'red' }}> *</span>
                </label>
                <select id="extension" {...register('extension', { required: true })}
                        defaultValue={thesis?.extension ? "true" : "false"} required>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="resourcesRequested">
                  Recursos:<span style={{ color: 'red' }}> *</span>
                </label>
                <select id="resourcesRequested" {...register('resourcesRequested', { required: true })}
                        defaultValue={thesis?.resourcesRequested ? "true" : "false"} required>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="end_time">
                  Fecha de Finalización: {errors.end_time && (
                    <span className={styles.errorMessage}></span> 
                  )}<span style={{ color: 'red' }}> *</span>
                </label>
                <input
                  type="date"
                  id="end_time"
                  {...register('end_time', { required: true })}
                  defaultValue={thesis?.endDate ? new Date(thesis.endDate).toISOString().split('T')[0] : ""}
                  required />
              </div>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Actualizar Tesis</button>
        </form>
      </div>
    </div>
  );
}

export default EditThesisForm;
