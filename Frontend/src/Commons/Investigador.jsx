import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from "./Navbar";
import '../styles/researcher.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";

import fotoPerfil from '../assets/usuario.jpeg';

const Investigador = () => {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [researcher, setResearcher] = useState(null);
    const [loading, setLoading] = useState(true);    
    const [researcherStudents, setResearcherStudents] = useState([]);
    const navigate = useNavigate();
    let { email } = useParams(); 

    useEffect(() => {
        const fetchResearcherData = async () => {
            try {
                const headers = isAuthenticated
                    ? { Authorization: `Bearer ${await getAccessTokenSilently()}` }
                    : {};
    
                const researcherUrl = `${import.meta.env.VITE_BACKEND_URL}/researcher/${email}`;
                const researcherPromise = axios.get(researcherUrl, { headers });
    
                let studentsPromise = null;
                if (isAuthenticated) {
                    const studentUrl = `${import.meta.env.VITE_BACKEND_URL}/userResearcher/researcher/${email}`;
                    studentsPromise = axios.get(studentUrl, { headers });
                }
    
                const [researcherResponse, studentsResponse] = await Promise.all([researcherPromise, studentsPromise]);
                setResearcher({
                    ...researcherResponse.data,
                    researcherStudents: studentsResponse?.data || []
                });
            } catch (error) {
                console.error('Error fetching researcher data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchResearcherData();
    }, [isAuthenticated]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Navbar/>
            <div className="one-researchers-container">
                {researcher && (
                    <div key={researcher.id} className="one-researcher-card">
                        <div className="one-image">
                            <img className="one-researcher-image" src={researcher.picture ? researcher.picture.url : fotoPerfil} alt={researcher.names} /> 
                        </div>
                        <div className="researcher-details">
                            <h2><strong>{researcher.names} {researcher.lastName} {researcher.secondLastName}</strong></h2>
                            <p><strong>Cargo:</strong> {researcher.charge}</p>
                            <p><strong>Líneas de investigación:</strong> {researcher.researchLines}</p>
                            <p><strong>Nacionalidad:</strong> {researcher.nationality}</p>
                            <p><strong>Email:</strong> {researcher.email}</p>
                            <p><strong>Estudiantes a cargo:</strong></p>
                            <ul>
                                {researcher.researcherStudents && researcher.researcherStudents.length > 0 ? (
                                    researcher.researcherStudents.map(student => (
                                        <li key={student.user.id}>{student.user.names} {student.user.lastName} - {student.tutorRol}</li>
                                    ))
                                ) : (
                                    <li>No informados</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
                <div className='researcher-button'>
                    <button onClick={() => navigate(-1)}>Volver</button>
                </div>                    
            </div>
        </div>
    );
};

export default Investigador;
