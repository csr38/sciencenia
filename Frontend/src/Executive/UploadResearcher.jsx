import React, { useState, useEffect } from 'react';
import Navbar from "../Commons/Navbar";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from '../styles/Upload.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import * as XLSX from 'xlsx';
import LoadingSpinner from "../Commons/LoadingSpinner"; 

const UploadResearcher = () => {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); 
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
    if (!isLoading && !loading && !loadingRole && userRole) {
        if (userRole !== 1) {
            navigate("/unauthorized");

        }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo .xls, .xlsx o .csv');
      return;
    }

    setLoading(true); 
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      if (!workbook.SheetNames.includes("Researchers")) {
        alert('El archivo debe contener una hoja llamada "Researchers".');
        setLoading(false); // Detén la carga
        return;
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
      const researchersData = XLSX.utils.sheet_to_json(sheet);
      console.log(researchersData); 
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const accessToken = await getAccessTokenSilently();
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/researcher/upload/researchers`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Archivo subido con éxito: ' + response.data.userMessage);
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        alert('Error al subir el archivo: ' + (error.response?.data.userMessage || error.userMessage));
      } finally {
        setLoading(false); // Detén la carga, ya sea con éxito o error
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.manageUsersContainer}>
        <h2 className={styles.title}>Selecciona un archivo excel para subir Investigadores</h2>

        {/* Muestra el spinner si el archivo está siendo procesado */}
        {loading ? (
          <LoadingSpinner /> 
        ) : (
          <>
            <input type="file" accept=".xls,.xlsx,.csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir archivo</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadResearcher;
