import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function EditProfileForm() {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  let { email } = useParams(); 
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  
  const roleId = watch('roleId'); // Se captura el rol seleccionado por el usuario

  // Lógica para obtener el rol del usuario autenticado
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

  // Obtener la información del usuario a editar
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
          console.log(accessToken);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isLoading, user, getAccessTokenSilently]);

  // useEffect(() => {
  //   const fetchInvestigatorEmails = async () => {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getInvestigators`);
  //       const emails = response.data.map(investigator => investigator.email);
  //       setInvestigatorEmails(emails);
  //     } catch (error) {
  //       console.error('Error fetching investigator emails:', error);
  //     }
  //   };
  //   fetchInvestigatorEmails();
  // }, []);

  const isChecked = (value) => {
    const allowedValues = userBack?.researchLines ?? [];
    return allowedValues.includes(value);
  };

  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 1) {                                      
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);


  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 1) {                                      
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  const getValidResearchLines = (value) => (value === null || value === false) ? [] : value;

  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const urlupdate = `${import.meta.env.VITE_BACKEND_URL}/users/${email}`;
      
      const userData = {
        rut: data.rut,
        email: data.email,
        names: data.names,
        lastName: data.lastName,
        secondLastName: data.secondLastName,
        roleId: data.roleId,
        phoneNumber: data.phoneNumber,
        academicDegree: data.academicDegree,
        researchLines: getValidResearchLines(data.researchLines),
        tutorEmail: data.tutorEmail,
      };

      const response = await axios.patch(urlupdate, userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(response.data)
      
      navigate('/EditProfiles');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (isLoading || loading || loadingRole) {
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
              <label htmlFor="names">Nombres: {errors.names && <span className="error-message">{errors.names.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="names" 
                  {...register('names', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/,
                      message: "Solo letras permitidas"
                    } 
                  })} 
                  defaultValue={userBack.names ?? ""} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido Paterno: {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="lastName" 
                  {...register('lastName', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/,
                      message: "Solo letras permitidas"
                    } 
                  })} 
                  defaultValue={userBack.lastName ?? ""} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="secondLastName">Apellido Materno: {errors.secondLastName && <span className="error-message">{errors.secondLastName.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="secondLastName" 
                  {...register('secondLastName', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/,
                      message: "Solo letras permitidas"
                    } 
                  })} 
                  defaultValue={userBack.secondLastName ?? ""} 
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="academicDegree">Grado Académico: {errors.academicDegree && <span className="error-message">{errors.academicDegree.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="academicDegree" 
                  {...register('academicDegree', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/,
                      message: "Solo letras permitidas"
                    } 
                  })} 
                  defaultValue={userBack.academicDegree ?? ""} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Celular: {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="phoneNumber" 
                  {...register('phoneNumber', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^\+?[0-9]{7,15}$/,
                      message: "Formato inválido, debe contener 8 números mínimo"
                    } 
                  })} 
                  defaultValue={userBack.phoneNumber ?? ""} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="institution">Institución: {errors.institution && <span className="error-message">{errors.institution.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="institution" 
                  {...register('institution', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/,
                      message: "Solo letras permitidas"
                    } 
                  })} 
                  defaultValue={userBack.institution ?? ""} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="rut">RUT: {errors.rut && <span className="error-message">{errors.rut.message}</span>}<span style={{ color: 'red' }}> *</span></label>
                <input 
                  type="text" 
                  id="rut" 
                  {...register('rut', { 
                    required: "Obligatorio", 
                    pattern: {
                      value: /^\d{7,8}-[kK\d]$/,
                      message: "Formato RUT inválido (Ej: 12345678-K)"
                    } 
                  })} 
                  defaultValue={userBack.rut ?? ""} 
                />
              </div>
            </div>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="roleId">Rol de usuario: <span style={{ color: 'red' }}> *</span></label>
                <select id="roleId" {...register('roleId', { required: true })} defaultValue={userBack?.roleId ?? ""} onSubmit={handleSubmit(onSubmit)} required>
                  <option value="2">Estudiante</option>
                  <option value="1">Ejecutivo</option>
                </select>
                {errors.roleId && <span className={styles.errorMessage}></span>}
              </div>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Actualizar Perfil</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;
