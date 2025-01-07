import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function RegistrarDatos() {

  const { isLoading, user, getAccessTokenSilently } = useAuth0();

  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      const fetchUserData = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
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

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const urlupdate = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
      
      const userData = {
        rut: data.rut,
        email: data.email,
        names: data.names,
        lastName: data.lastName,
        secondLastName: data.secondLastName,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        grade: data.academicDegree
      };

      await axios.patch(urlupdate, userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (isLoading || loading ) {
    return <LoadingSpinner/>;
  }

  return (!isLoading && !loading) && (
    <div className={styles.background}>
            <Navbar />
            <div className={styles.editInvestigatorProfileFormContainer}>
                <h2 className={styles.formTitle}>Editar Perfil</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.infoForm}>
                    <div className={styles.formColumnsContainer}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="names">Nombres: {errors.names && <span className={styles.errorMessage}>*Obligatorio</span>}</label>
                                <input type="text" id="names" {...register('names', { required: true })} defaultValue={userBack.names ?? ""} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Apellido Paterno: {errors.lastName && <span className={styles.errorMessage}>*Obligatorio</span>}</label>
                                <input type="text" id="lastName" {...register('lastName', { required: true })} defaultValue={userBack.lastName ?? ""} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="secondLastName">Apellido Materno: {errors.secondLastName && <span className={styles.errorMessage}>*Obligatorio</span>}</label>
                                <input type="text" id="secondLastName" {...register('secondLastName', { required: true })} defaultValue={userBack.secondLastName ?? ""} />
                            </div>
                        </div>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="academicDegree">Grado Académico: {errors.academicDegree && <span className={styles.errorMessage}>*Obligatorio</span>}</label>
                                <input type="text" id="academicDegree" {...register('academicDegree', { required: true })} defaultValue={userBack.grade ?? ""} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phoneNumber">Celular: {errors.phoneNumber && <span className={styles.errorMessage}>*Obligatorio</span>}</label>
                                <input type="text" id="phoneNumber" {...register('phoneNumber', { required: true })} defaultValue={userBack.phoneNumber ?? ""} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="rut">RUT: {errors.rut && <span className={styles.errorMessage}>*Obligatorio</span>}</label>
                                <input type="text" id="rut" {...register('rut', { required: true })} defaultValue={userBack.rut ?? ""} />
                            </div>
                        </div>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="gender">Género: </label>
                                <select id="gender" {...register('gender', { required: true })} defaultValue={userBack.gender ?? ""}>
                                    <option value="">Seleccione...</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>
                                {errors.gender && <span className={styles.errorMessage}>*Obligatorio</span>}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>Actualizar Perfil</button>
                </form>
            </div>
        </div>
  );
}

export default RegistrarDatos;
