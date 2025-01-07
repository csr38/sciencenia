import React, { useState, useEffect } from 'react';
import '../styles/profile.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar"; 
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ThesisDetails = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  //Seteo de toda la información solicitada a la API
  const [userBack, setUserBack] = useState(null);
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  //Solicitud de tipo GET a la API para obtener información del usuario por medio de su correo (exije Token).
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
          setLoadingRole(false);
        }
      }
    };

    fetchUserData();
  }, [isLoading, user, getAccessTokenSilently]);

  //Solicitud de tipo GET a la API para obtener información de la tesis del usuario por medio de su correo (exije Token).
  useEffect(() => {
    const fetchThesisData = async () => {
      if (!isLoading && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          console.log(user.email);
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

  // Si el usuario no tiene tesis asociada, se muestra mensaje.
  useEffect(() => {
    if (!isLoading && !loading && !loadingRole) {
      if (userRole !== 2) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  if (isLoading || loading || loadingRole) {
    return <LoadingSpinner/>;
  }

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
        <div className='big-container'>
          <div className="container">
            <div className='info-container'>
              <div className='data-container'>
                <h2>{thesis.title}</h2>
                <p><strong>Autor:</strong> {userBack.names}</p>
                <p><strong>Estado:</strong> {thesis.status}</p>
                {/* <p><strong>Nota:</strong> {thesis.grade}</p> */}
                <p><strong>Institución:</strong> {userBack.institution}</p>
                <p><strong>Fecha de inicio:</strong> {new Date(thesis.startDate).toLocaleDateString()}</p>
                <p><strong>Fecha de fin:</strong> {new Date(thesis.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <button className="profile-button" onClick={() => navigate(-1)}>Volver</button>
            <button className="profile-button" onClick={() => navigate("/EditThesisForm")}>Editar</button>
          </div>
        </div>
      </div>
    ); 
  }
}

export default ThesisDetails;