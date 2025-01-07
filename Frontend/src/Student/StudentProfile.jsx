import React, { useState, useEffect } from 'react';
import '../styles/profile.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar"; 
import LoadingSpinner from "../Commons/LoadingSpinner"; 
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import perfilImage from "../assets/usuario.jpeg";

const StudentProfile = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [userBack, setUserBack] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [thesisTitle, setThesisTitle] = useState(null);
  const [tutorName, setTutorName] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState({
    user: true,
    thesis: true,
    tutor: true,
    role: true,
  });

  // Fetch user data
  const fetchUserData = async () => {
    if (!isLoading && user) {
      try {
        const accessToken = await getAccessTokenSilently();
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
        console.log("Fetching user data from:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.data) {
          console.log("User data received:", response.data);
          setUserBack(response.data);
          setUserRole(response.data.roleId);
          setUploadedImage(response.data.picture?.url || perfilImage);
        } else {
          console.warn('No user data returned from the backend.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data.');
      } finally {
        setLoading(prev => ({ ...prev, user: false, role: false }));
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isLoading, user, getAccessTokenSilently]);

  // Fetch thesis data
  useEffect(() => {
    const fetchThesisData = async () => {
      if (user) {
        try {
          const accessToken = await getAccessTokenSilently();
          const urlThesis = `${import.meta.env.VITE_BACKEND_URL}/thesis/${user.email}`;
          const response = await axios.get(urlThesis, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const thesisInfo = response.data;
          setThesisTitle(thesisInfo.title);
        } catch (error) {
          console.error('Error fetching thesis data:', error);
        } finally {
          setLoading(prev => ({ ...prev, thesis: false }));
        }
      }
    };

    fetchThesisData();
  }, [user, getAccessTokenSilently]);

  // Fetch tutor data
  useEffect(() => {
    const fetchTutorData = async () => {
      if (userBack && userBack.tutorEmail) {
        try {
          const accessToken = await getAccessTokenSilently();
          const urlTutor = `${import.meta.env.VITE_BACKEND_URL}/users/${userBack.tutorEmail}`; 
          const response = await axios.get(urlTutor, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setTutorName(`${response.data.names} ${response.data.lastName}`);
        } catch (error) {
          console.error('Error fetching tutor data:', error);
        } finally {
          setLoading(prev => ({ ...prev, tutor: false }));
        }
      } else {
        setLoading(prev => ({ ...prev, tutor: false }));
      }
    };

    fetchTutorData();
  }, [userBack, getAccessTokenSilently]);

  // Redirect if unauthorized
  useEffect(() => {
    if (Object.values(loading).every((item) => item === false)) {
      if (userRole !== 2) {
        navigate("/unauthorized");
      }
    }
  }, [loading, userRole, navigate]);

  // Image upload handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        // Fetch a fresh token before making the request
        const accessToken = await getAccessTokenSilently();
        const formData = new FormData();
        formData.append('file', file);
  
        console.log('Attempting to upload image:', file);
  
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/uploadPicture`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );
  
        console.log('Image uploaded successfully:', response.data);
  
        if (response.data.picture?.url) {
          setUploadedImage(response.data.picture.url);
          setUserBack(prevUserBack => ({
            ...prevUserBack,
            picture: { ...prevUserBack.picture, url: response.data.picture.url }
          }));
        } else {
          console.warn("No image URL returned after upload.");
        }
  
        alert('Imagen subida correctamente');
        fetchUserData();
  
      } catch (error) {
        console.error('Error uploading image:', error);
  
        if (error.response) {
          console.error('Backend error response:', error.response.data);
          alert(`Error al subir la imagen: ${error.response.data.message || "Inténtalo de nuevo."}`);
        } else {
          alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
        }
      }
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  };
  

  // Profile image source
  const profileImageSrc = uploadedImage || perfilImage;

  // Display loading spinner if still loading
  if (Object.values(loading).some((item) => item === true)) {
    return <LoadingSpinner />;
  }

  return (
    <div className='background'>
      <Navbar />
      <div className='big-container'>
        <div className="container">
          <div className='info-container'>
            <div className="profile-image-container">
              <img className="profile-image" src={profileImageSrc} alt="Profile" />
              <div className="upload-button-container">
                <label htmlFor="imageUpload" className="upload-button">
                  {uploadedImage ? 'Actualizar' : 'Subir Imagen'}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className='data-container'>
              <h2>{userBack?.names ?? ""} {userBack?.lastName ?? ""} {userBack?.secondLastName === "No informado" ? "" : userBack?.secondLastName}</h2>
              <p><strong></strong> {userBack?.academicDegree ?? "No informado"}</p>
              <p><strong></strong> {userBack?.institution ?? "No informado"}</p>
              <p><strong>Username:</strong> {userBack?.username ?? "No informado"}</p>
              <p><strong>RUT:</strong> {userBack?.rut ?? "No informado"}</p>
              <p><strong>Email:</strong> {userBack?.email ?? "No informado"}</p>
              <p><strong>Género:</strong> {userBack?.gender ?? "No informado"}</p>
              <p><strong>Número de Teléfono:</strong> {userBack?.phoneNumber ?? "No informado"}</p>
              <p><strong>Líneas de Investigación:</strong> {userBack?.researchLines ? userBack.researchLines.join(', ') : "No informado"}</p>
              <p><strong>Tesis:</strong><a href={`/ThesisDetails`} className="thesis-link">{thesisTitle ?? "No asignada"}</a></p>
              <p><strong>Tutor(es):</strong>
                {userBack?.tutors?.length > 0 ? (
                  userBack.tutors.map((tutor, index) => (
                    <a key={index} href={`/Investigador/${tutor.email}`} className="thesis-link"> {tutor.names} {tutor.lastName}</a>
                  ))
                ) : (
                  " No informado"
                )}
              </p>
            </div>
          </div>
          <button className="profile-button" onClick={() => navigate("/EditStudentProfile")}>Editar</button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
