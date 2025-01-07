import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import axios from 'axios';
import styles from '../styles/ManagePublications.module.css';
import { useAuth0 } from "@auth0/auth0-react";

const ManagePublications = () => {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const { email } = useParams();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && user.email) {
        try {
          // Cambiamos la verificación al nuevo rol de ejecutivo (roleId === 1)
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
      // Verificamos que el usuario sea un ejecutivo (roleId === 1)
      if (userRole !== 1) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        // Obtenemos las publicaciones específicas del investigador por su email
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/research/${email}`);
        setPublications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setLoading(false);
      }
    };

    fetchPublications();
  }, [email]);

  const handleSearch = () => {
    // Implementar la lógica de búsqueda aquí
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar esta publicación?");

    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/research/${id}`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting publication:', error);
      }
    }
  };

  const filteredPublications = publications.filter(publication =>
    publication.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.title}>Publicaciones</h1>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div className={styles.publicationsListContainer}>
        {filteredPublications.map((publication, index) => (
          <div className={styles.publicationCard} key={index}>
              <h3>
                  <a href={publication.link}>{publication.title}</a>
              </h3>
            <div className={styles.publicationInfo}>
              <p><strong>DOI:</strong> {publication.doi}</p>
              <p><strong>Año:</strong> {publication.year || "N/A"}</p>
              <p><strong>Mes:</strong> {publication.month || "N/A"}</p>
              <p><strong>Páginas:</strong> {publication.firstPage}-{publication.lastPage || "N/A"}</p>
              <p><strong>Notas:</strong> {publication.notes || "N/A"}</p>
              <p><strong>PDF:</strong> <a href={publication.pdf} download>{publication.pdf}</a></p>
              <p><strong>Creado en:</strong> {new Date(publication.createdAt).toLocaleString() || "N/A"}</p>
              <p><strong>Actualizado en:</strong> {new Date(publication.updatedAt).toLocaleString() || "N/A"}</p>
            </div>
            <div className={styles.actionsContainer}>
              <button onClick={() => navigate(`/EditPublication/${publication.id}`)}>Editar</button>
              <button onClick={() => handleDelete(publication.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePublications;
