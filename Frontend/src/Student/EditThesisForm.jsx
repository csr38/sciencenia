import React, { useState, useEffect } from 'react';
import '../styles/forms.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar"; 
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import TestToken from '../Auth0/TestToken';

const EditThesisForm = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [userBack, setUserBack] = useState(null);
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Solicitud a la API de tipo GET para obtener los datos del usuario a través de su email(exije token).
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoading && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setUserBack(response.data);
          setUserRole(response.data.roleId);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
          setLoadingRole(false)
        }
      }
    };

    fetchUserData();
  }, [isLoading, user, getAccessTokenSilently]);


  // Solicitud a la API de tipo GET para obtener los datos de la tesis del usuario a través de su email(exije token).
  useEffect(() => {
    const fetchThesisData = async () => {
      if (!isLoading && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/thesis/${user.email}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setThesis(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching thesis data:', error);
        }
      }
    };

    fetchThesisData();
  }, [isLoading, user, getAccessTokenSilently]);

  // Si no es estudiante no permite acceso.
  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 2) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  // Solicitud a la API de tipo POST para actualizar los datos de la tesis del usuario (exije token).
  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const url = `${import.meta.env.VITE_BACKEND_URL}/thesis/${thesis.id}`;
      const thesisData = {
        title: data.title,
        endDate: data.endDate,
      };

      await axios.patch(url, thesisData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      navigate('/ThesisDetails');
    } catch (error) {
      console.error('Error updating thesis:', error);
    }
  };

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner />;
  }

  // Si el usuario no tiene tesis asociada, se muestra mensaje.
  if (!thesis) {
    return (
      <div className='background'>
        <Navbar />
        <div> No hay tesis registradas </div>
      </div>
    );
  } else {
    return (
      <div className='background'>
        <Navbar />
        <div className='edit-thesis-form-container'>
          <h2 className='form-title'>Editar Tesis</h2>
          <form onSubmit={handleSubmit(onSubmit)} className='thesis-form'>
            <div className='form-group'>
              <label htmlFor='title'>Título de la Tesis: {errors.title && <span className='error-message'>*Obligatorio</span>}</label>
              <input type='text' id='title' defaultValue={thesis.title} {...register('title', { required: true })} />
            </div>
            <div className='form-group'>
              <label htmlFor='endDate'>Fecha de Fin: {errors.endDate && <span className='error-message'>*Obligatorio</span>}</label>
              <input type='date' id='endDate' defaultValue={thesis.endDate.split('T')[0]} {...register('endDate', { required: true })} />
            </div>
            <button type='submit' className='submit-button'>Actualizar Tesis</button>
          </form>
        </div>
      </div>
    );
  }
}

export default EditThesisForm;
