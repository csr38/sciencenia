import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from "./Navbar";
import '../styles/researchers.css'; 
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import fotoPerfil from '../assets/usuario.jpeg';

const Investigadores = () => {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [researchers, setResearchers] = useState([]);
    const [researchLines, setResearchLines] = useState([]);
    const [loading, setLoading] = useState(true);    
    const navigate = useNavigate();
    const researchLinesOptions = [
        { key: "DL for Vision and Language", value: "RL1 / Aprendizaje profundo para visión y lenguaje" },
        { key: "Neuro-Symbolic AI", value: "RL2 / IA neuro-simbólica" },
        { key: "Brain-Inspired AI", value: "RL3 / IA inspirada en el cerebro" },
        { key: "Physics-Informed Machine Learning", value: "RL4 / Aprendizaje automático basado en la física" },
        { key: "Human Centered AI", value: "RL5 / IA centrada en las personas" }
    ];  

    useEffect(() => {
        const fetchResearchers = async () => {
            try {
                const headers = {};
                const params = {
                    researchLines: researchLines,
                };

                if (isAuthenticated) {
                    const accessToken = await getAccessTokenSilently();
                    headers.Authorization = `Bearer ${accessToken}`;
                }

                const url = `${import.meta.env.VITE_BACKEND_URL}/researcher/researchLine`;
                const response = await axios.post(url, params, { headers });
                setResearchers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching researchers:', error);
                setLoading(false);
            }
        };
        fetchResearchers();
    }, [isLoading, isAuthenticated, getAccessTokenSilently, researchLines]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Navbar />
            <h1 className="tab-title">Investigadores(as) Cenia</h1>
            <div className="main-container">
            <div className="filters-column">
                <div className="filter-input">
                    <label><strong>Filtrar por Línea de Investigación:</strong></label>
                    <div className='checkbox-lines'>
                        {researchLinesOptions.map((line) => (
                            <div key={line.key} className="research-line-filter-option">
                                <input
                                    type="checkbox"
                                    value={line.key}
                                    checked={researchLines.includes(line.key)}
                                    onChange={(e) => {
                                        setResearchLines((prevLines) => 
                                            e.target.checked
                                                ? [...prevLines, line.key] 
                                                : prevLines.filter(item => item !== line.key)
                                        );
                                    }}
                                />
                                <span><strong>{line.value}</strong></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="researchers-column">
                <div className="researchers-container">
                    {researchers.map(investigador => (
                        <div
                            key={investigador.id}
                            className="researcher-card"
                            onClick={() => navigate(`/Investigador/${investigador.email}`)} >
                            <div className="image">
                                <img className="researcher-image" src={investigador.picture ? investigador.picture.url : fotoPerfil} alt={investigador.names} /> 
                                <h2><strong>{investigador.names} {investigador.lastName}</strong></h2>
                                <p><strong>Cargo:</strong> {investigador.charge}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Investigadores;
