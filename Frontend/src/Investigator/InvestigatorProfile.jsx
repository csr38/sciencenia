import React, { useState, useEffect } from 'react';
import '../styles/profile.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";  
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import perfilImage from "../assets/usuario.jpeg";

const InvestigatorProfile = () => {
  const { isLoading, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userBack, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publications, setPublication] = useState(null);
  const [loadingP, setLoadingP] = useState(true);
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
        if (user && user.email) { // Check if user object and user email are defined
            try {
                const accessToken = await getAccessTokenSilently();
                const urlpublicaciones = `${import.meta.env.VITE_BACKEND_URL}/research/${user.email}`;
                const response = await axios.get(urlpublicaciones, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setPublication(response.data);
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
    if (!isLoading && !loading && !loadingP && !loadingRole) {
      if (userRole !== 4) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingP, loadingRole, userRole, navigate]);

  if (isLoading || loading || loadingP || loadingRole) {
    return <LoadingSpinner/>;
  }

  return (
    !isLoading && !loading && !loadingP && !loadingRole && (
      <div className='background'>
        <Navbar />
        <div className='big-container'>
          <div className="container">
            <button className="profile-button" onClick={() => navigate("/EditInvestigatorProfileForm")}>Editar</button>
            <div className='info-container'>
              <img className="profile-image" src={user.picture ?? perfilImage} alt="Profile" />
              <div className='data-container'>
                <h2>{userBack.names ?? ""} {userBack.lastName ?? ""} {userBack?.secondLastName === "No informado" ? "" : userBack?.secondLastName}</h2>
                <h3> {userBack?.grade === "No informado" ? "" : userBack?.grade}</h3>
                {userBack.researchLines && (
                  <div className="research-lines">
                    {userBack.researchLines.map((linea, index) => (
                      <div key={index} className="research-line">{linea}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default InvestigatorProfile;
