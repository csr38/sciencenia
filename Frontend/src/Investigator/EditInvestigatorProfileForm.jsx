import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css'; 
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";  
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function EditInvestigatorProfileForm() {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
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
          reset(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isLoading, user, getAccessTokenSilently, reset]);

  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 4) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

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
        grade: data.academicDegree,
        researchLines: data.researchLines ?? []
      };

      await axios.patch(urlupdate, userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      navigate('/InvestigatorProfile');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const isChecked = (value) => {
    const allowedValues = userBack?.researchLines ?? [];
    return allowedValues.includes(value);
  };

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner/>;
  }

  return (
    !isLoading && !loading && (
      <div className="background">
        <Navbar />
        <div className="edit-investigator-profile-form-container">
          <h2 className="form-title">Editar Perfil</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="info-form">
            <div className="form-columns-container">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="names">Nombres: {errors.names && <span className="error-message">*Obligatorio</span>}</label>
                  <input type="text" id="names" {...register('names', { required: true })} defaultValue={userBack?.names ?? ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Apellido Paterno: {errors.lastName && <span className="error-message">*Obligatorio</span>}</label>
                  <input type="text" id="lastName" {...register('lastName', { required: true })} defaultValue={userBack?.lastName ?? ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="secondLastName">Apellido Materno: {errors.secondLastName && <span className="error-message">*Obligatorio</span>}</label>
                  <input type="text" id="secondLastName" {...register('secondLastName', { required: true })} defaultValue={userBack?.secondLastName ?? ""} />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="academicDegree">Grado Académico: {errors.academicDegree && <span className="error-message">*Obligatorio</span>}</label>
                  <input type="text" id="academicDegree" {...register('academicDegree', { required: true })} defaultValue={userBack?.grade ?? ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Celular: {errors.phoneNumber && <span className="error-message">*Obligatorio</span>}</label>
                  <input type="text" id="phoneNumber" {...register('phoneNumber', { required: true })} defaultValue={userBack?.phoneNumber ?? ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="rut">RUT: {errors.rut && <span className="error-message">*Obligatorio</span>}</label>
                  <input type="text" id="rut" {...register('rut', { required: true })} defaultValue={userBack?.rut ?? ""} />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="gender">Género: </label>
                  <select id="gender" {...register('gender', { required: true })} defaultValue={userBack?.gender ?? ""}>
                    <option value="">Seleccione...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.gender && <span className="error-message">*Obligatorio</span>}
                </div>
                <div className="form-group">
                  <label className="research-label">Líneas de Investigación: {errors.researchLines && <span className="error-message">*Obligatorio</span>}</label>
                  <div className="research-options">
                    <label>
                      <input type="checkbox" {...register('researchLines')} value="Aprendizaje profundo para visión y lenguaje" defaultChecked={isChecked("Aprendizaje profundo para visión y lenguaje")} />
                      Aprendizaje profundo para visión y lenguaje
                    </label>
                    <label>
                      <input type="checkbox" {...register('researchLines')} value="IA neuro-simbólica" defaultChecked={isChecked("IA neuro-simbólica")} />
                      IA neuro-simbólica
                    </label>
                    <label>
                      <input type="checkbox" {...register('researchLines')} value="IA inspirada en el cerebro" defaultChecked={isChecked("IA inspirada en el cerebro")} />
                      IA inspirada en el cerebro
                    </label>
                    <label>
                      <input type="checkbox" {...register('researchLines')} value="Aprendizaje automático basado en la física" defaultChecked={isChecked("Aprendizaje automático basado en la física")} />
                      Aprendizaje automático basado en la física
                    </label>
                    <label>
                      <input type="checkbox" {...register('researchLines')} value="IA centrada en las personas" defaultChecked={isChecked("IA centrada en las personas")} />
                      IA centrada en las personas
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="submit-button">Actualizar Perfil</button>
          </form>
        </div>
      </div>
    )
  );
}

export default EditInvestigatorProfileForm;
