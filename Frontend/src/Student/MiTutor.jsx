import React, { useState, useEffect } from 'react';
import '../styles/profile.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";  
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import perfilImage from "../assets/usuario.jpeg";

//ESTE ARCHIVO DEBERÍA BORRARSE YA QUE NO SE USA

const MiTutor = () => {
  const { isLoading, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingP, setLoadingP] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [tutorData, setTutorData] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(true);
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
    const fetchUserData = async () => {
      if (!isLoading && isAuthenticated) {
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
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isLoading, isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    const fetchPublications = async () => {
      if (user && user.email) { 
        try {
          const accessToken = await getAccessTokenSilently();
          const urlpublicaciones = `${import.meta.env.VITE_BACKEND_URL}/research/${user.email}`;
          const response = await axios.get(urlpublicaciones, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          // setPublication(response.data);
          setLoadingP(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoadingP(false);
        }
      } else {
        setLoadingP(false);
      }
    };

    if (user) { 
      fetchPublications();
    }
  }, [user, getAccessTokenSilently]);

  useEffect(() => {
    if (userBack && userBack.tutorEmail) {
      const fetchTutorData = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/${userBack.tutorEmail}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setTutorData(response.data);
          setLoadingTutor(false);
        } catch (error) {
          console.error('Error fetching tutor data:', error);
          setLoadingTutor(false);
        }
      };

      fetchTutorData();
    } else {
      setLoadingTutor(false);
    }
  }, [userBack, getAccessTokenSilently]);

  useEffect(() => {
    if (!isLoading && !loading && !loadingP && !loadingRole && !loadingTutor) {
      if (userRole !== 2) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingP, loadingRole, loadingTutor, userRole, navigate]);

  if (isLoading || loading || loadingP || loadingRole || loadingTutor) {
    return <LoadingSpinner />;
  }

  if (!userBack?.tutorEmail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
        <Navbar />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: "#090E50" }}>No tienes un tutor asignado</h1>
        </div>
      </div>
    );
  }

  return (
    !isLoading && !loading && !loadingP && !loadingRole && (
      <div className='background'>
        <Navbar />
        <div className='big-container'>
          <div className="container">
            {tutorData && (
              <div className='info-container'>
                <img className="profile-image" src={tutorData.image ?? perfilImage} alt='Profile Image' />
                <div className='data-container'>
                  <h2>{tutorData.names ?? ""} {tutorData.lastName ?? ""} {tutorData.secondLastName === "No informado" ? "" : tutorData.secondLastName}</h2>
                  <h3>{tutorData.grade === "No informado" ? "" : tutorData.grade}</h3>
                  <h3>Email: {tutorData.email ?? ""}</h3>
                  {tutorData.researchLines && (
                    <div className="research-lines">
                      {tutorData.researchLines.map((linea, index) => (
                        <div key={index} className="research-line">{linea}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MiTutor;
