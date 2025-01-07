import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import styles from '../styles/ManagePublications.module.css';
import { useAuth0 } from "@auth0/auth0-react";

const ManageAllPublications = () => {
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [actualSearchTerm, setActualSearchTerm] = useState('');
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Eliminación de los roles que ya no existen y ajuste para trabajar solo con dos roles (Ejecutivo y Estudiante)
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

    // Cambiado para asegurar que solo los ejecutivos (roleId 1) puedan acceder a esta página
    useEffect(() => {
        if (!isLoading && !loading && !loadingRole && userRole) {
            if (userRole !== 1) {
                navigate("/unauthorized");

            }
        }
    }, [isLoading, loading, loadingRole, userRole, navigate]);

    useEffect(() => {
        const fetchPublications = async () => {
            if (!isLoading && isAuthenticated) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = isSearchActive && actualSearchTerm !== ''
                        ? `${import.meta.env.VITE_BACKEND_URL}/research/search`
                        : `${import.meta.env.VITE_BACKEND_URL}/research`;

                    const params = {
                        page: page,
                        ...(isSearchActive && actualSearchTerm && { title: actualSearchTerm }) 
                    };

                    const response = await axios.get(url, {
                        params: params,
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    setTotalPages(response.data.pages); 
                    setPublications(response.data.data); 
                    setLoading(false); 
                } catch (error) {
                    console.error('Error fetching publications:', error);
                    setLoading(false); 
                }
            }
        };

        fetchPublications();
    }, [isLoading, isAuthenticated, getAccessTokenSilently, page, isSearchActive, actualSearchTerm]);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            if (!isSearchActive) {
                return;
            }
            setIsSearchActive(false);
            setActualSearchTerm(''); 
        } else {
            if (searchTerm === actualSearchTerm) {
                return;
            }
            setIsSearchActive(true);
            setActualSearchTerm(searchTerm); 
        }
        setPage(1); 
        setLoading(true); 
    };

    const handlePageChange = (newPage) => {
        setPage(newPage); 
        setLoading(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar esta publicación?");
        if (confirmDelete) {
            try {
                const accessToken = await getAccessTokenSilently();
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/research/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setPublications(publications.filter(pub => pub.id !== id)); 
            } catch (error) {
                console.error('Error deleting publication:', error);
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>Gestionar Publicaciones</h1>
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <div className={styles.publicationsListContainer}>
                {publications.map((publication, index) => (
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
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={p === page ? styles.active : ''}
                        disabled={p === page}
                    >
                        {p}
                    </button>
                ))}
            </div>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default ManageAllPublications;
