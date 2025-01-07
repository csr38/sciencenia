import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css'; 
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function EditStudentProfileForm() {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

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

  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 2) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const urlupdate = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
      
      const userData = {
        requesterEmail: "ejecutivo@email.com",
        rut: data.rut,
        email: data.email,
        names: data.names,
        lastName: data.lastName,
        secondLastName: data.secondLastName,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        academicDegree: data.academicDegree,
        institution: data.institution 
      };

      await axios.patch(urlupdate, userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      navigate('/StudentProfile');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner/>;
  }

  return (!isLoading && !loading) && (
    <div className="background">
      <Navbar />
      <div className="edit-investigator-profile-form-container">
        <h2 className="form-title">Editar Perfil</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="info-form">
          <div className="form-columns-container">
            <div className="form-column">
              <div className="form-group">
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
                <label htmlFor="rut">RUT: {errors.rut && <span className="error-message">{errors.rut.message}</span>}<span style={{ color: 'red', marginLeft: '4px' }}> *</span></label>
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
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="gender">Género: </label>
                <select id="gender" {...register('gender', { required: "Obligatorio" })} defaultValue={userBack.gender ?? ""}> <span style={{ color: 'red' }}> *</span>
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender.message}</span>}
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">Actualizar Perfil</button>
        </form>
      </div>
    </div>
  );
}

export default EditStudentProfileForm;
