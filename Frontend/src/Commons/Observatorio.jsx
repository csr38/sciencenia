import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";
import styles from '../styles/Observatorio.module.css';
import { useAuth0 } from "@auth0/auth0-react";

const Observatorio = () => {
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [author, setAuthor] = useState('');
    const [researchLines, setResearchLines] = useState([]);
    const [doi, setDoi] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);

    const researchLinesOptions = [
        { key: "DL for Vision and Language", value: "RL1 / Aprendizaje profundo para visión y lenguaje" },
        { key: "Neuro-Symbolic AI", value: "RL2 / IA neuro-simbólica" },
        { key: "Brain-Inspired AI", value: "RL3 / IA inspirada en el cerebro" },
        { key: "Physics-Informed Machine Learning", value: "RL4 / Aprendizaje automático basado en la física" },
        { key: "Human Centered AI", value: "RL5 / IA centrada en las personas" }
    ];

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
        const fetchPublications = async () => {
            try {
                const headers = {};
                if (isAuthenticated) {
                    const accessToken = await getAccessTokenSilently();
                    headers.Authorization = `Bearer ${accessToken}`;
                }

                const url = `${import.meta.env.VITE_BACKEND_URL}/research/search/`;
                const params = {
                    page: page,
                    filters: {
                        ...(searchTerm && { title: searchTerm }),
                        ...(minYear && { minYear: minYear }),
                        ...(maxYear && { maxYear: maxYear }),
                        ...(author && { author: author }),
                        ...(doi && { doi: doi }),
                        ...(researchLines && { researchLines: researchLines })
                    },
                };

                const response = await axios.post(url, params, { headers });

                setPublications(response.data.data);
                setTotalPages(response.data.pages || 0);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching publications:', error);
                setLoading(false);
                setError('Error fetching publications.');
            }
        };

        fetchPublications();
    }, [isLoading, isAuthenticated, getAccessTokenSilently, page, searchTerm, minYear, maxYear, author, doi, researchLines]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setLoading(true);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Navbar />
            <div className={styles.observatorioContainer}>
                <div className={styles.bigContainer}>
                    <div className={styles.filterTab}>
                        <h2>Filtros</h2>
                        <div className={styles.searchBarContainer}>
                            <input
                                className={styles.searchBarInput}
                                type="text"
                                placeholder="Buscar por título..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.yearInput}>
                            <div className={styles.filterInput}>
                                <label>Año inicio</label>
                                <input
                                    type="number"
                                    placeholder="Año inicio"
                                    value={minYear}
                                    onChange={(e) => setMinYear(e.target.value)}
                                />
                            </div>
                            <div className={styles.filterInput}>
                                <label>Año Final</label>
                                <input
                                    type="number"
                                    placeholder="Año Final"
                                    value={maxYear}
                                    onChange={(e) => setMaxYear(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.filterInput}>
                            <label>Por autor:</label>
                            <input
                                type="text"
                                placeholder="Ingrese Autor..."
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                        <div className={styles.filterInput}>
                            <label>Por DOI:</label>
                            <input
                                type="text"
                                placeholder="Ingrese DOI..."
                                value={doi}
                                onChange={(e) => setDoi(e.target.value)}
                            />
                        </div>
                        <div className={styles.filterInput}>
                            <label>Por Línea de Investigación:</label>
                            <div>
                                {researchLinesOptions.map((line) => (
                                    <div key={line.key} className={styles.researchLineFilterOption}>
                                        <input
                                            type="checkbox"
                                            value={line.key}
                                            checked={researchLines.includes(line.key)}
                                            onChange={(e) => {
                                                setResearchLines((prevLines) =>
                                                    e.target.checked
                                                        ? [...prevLines, line.key]
                                                        : prevLines.filter((item) => item !== line.key)
                                                );
                                            }}
                                        />
                                        <span>{line.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>  
                    </div>
                    <div className={styles.researchsTab}>
                        <h1 className={styles.title}>Observatorio</h1>
                        <div className={styles.publiContainer}>
                            {publications && publications.map((publication, index) => (
                                <div className={styles.publi} key={index}>
                                    <div className={styles.publicationTitle}>
                                        <a href={publication.link} target="_blank" rel="noopener noreferrer">
                                            {publication.title}
                                        </a>
                                    </div>
                                    <div className={styles.doi}>
                                        Autores: {publication.authors.map((author, index) => (
                                            <span key={index}>{author}; </span>
                                        ))}
                                    </div>
                                    <div className={styles.doi}>
                                        Año de publicación: {publication.yearPublished}
                                    </div>
                                    <div className={styles.doi}>
                                        <strong>DOI:</strong> {publication.doi}
                                    </div>
                                </div>
                            ))}
                            <div 
                            className={styles.pagination} 
                            style={{ '--button-count': totalPages }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={p === page ? styles.active : ''}
                                        disabled={p === page}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
};

export default Observatorio;
