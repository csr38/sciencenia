import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../../Commons/Navbar";
import styles from '../../styles/NuevaSolicitud.module.css';
import LoadingSpinner from "../../Commons/LoadingSpinner";

const NuevaSolicitudIncentivo = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const [userBack, setUser] = useState(null);
    let { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        studentSituation: "",
        studentFullName: "",
        applicationPeriodId: id,
        emailStudent: "",
        graduationDate: "",
        scientificProduction: "",
        conferenceParticipations: "",
        otherCentersAffiliation: "",
        otherProgramsFunding: "",
        anidScholarshipApplication: false,
        nonAnidScholarshipJustification: "",
        ceniaParticipationActivities: "",
        files: [], // Changed to an array for multiple files
        bankName: "",
        bankAccountType: "",
        bankAccountNumber: "",
        amountRequested: 0,
    });

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
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, [user, isLoading, getAccessTokenSilently]);

    useEffect(() => {
        if (userBack) {
            setFormData(prevState => ({
                ...prevState,
                studentFullName: `${userBack.names} ${userBack.lastName}`,
                emailStudent: userBack.email,
            }));
        }
    }, [userBack]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...files], // Append files
        }));
    };

    const handleRemoveFile = (index) => {
        setFormData(prevState => ({
            ...prevState,
            files: prevState.files.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship`;
            const formDataObj = new FormData();
            for (const key in formData) {
                if (key === 'files' && formData[key].length > 0) {
                    formData[key].forEach(file => {
                        formDataObj.append('files', file, file.name); // Support multiple files
                    });
                } else if (key === 'anidScholarshipApplication') {
                    formDataObj.append(key, formData[key] ? 'true' : 'false');
                } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
                    formDataObj.append(key, formData[key]);
                }
            }

            const response = await axios.post(url, formDataObj, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            alert('Solicitud realizada con éxito! Revisa tu correo para esperar la confirmación de un ejecutivo.');
            navigate(-1);
        } catch (error) {
            alert('Error al hacer la solicitud. ' + error.response.data.message)
            console.error('Error submitting form:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>Nueva Solicitud</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Nombre y Apellido del Estudiante</label>
                        <input type="text" value={formData.studentFullName} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Correo</label>
                        <input type="text" value={formData.emailStudent} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="graduationDate">
                            Fecha de Graduación<span style={{ color: 'red' }}> *</span>
                        </label>
                        <input type="date" id="graduationDate" name="graduationDate" value={formData.graduationDate} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="scientificProduction">Producción científica<span style={{ color: 'red' }}> *</span></label>
                        <textarea id="scientificProduction" name="scientificProduction" value={formData.scientificProduction} onChange={handleChange} required></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="conferenceParticipations">Actividades de Participación CENIA</label>
                        <textarea id="conferenceParticipations" name="conferenceParticipations" value={formData.conferenceParticipations} onChange={handleChange}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="files">Producción científica (archivos)</label>
                        <input
                            type="file"
                            id="files"
                            name="files"
                            accept=".pdf"
                            multiple // Allow multiple file selection
                            onChange={handleFileChange}
                        />
                        <div>
                            {formData.files.map((file, index) => (
                                <div key={index}>
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="otherCentersAffiliation">Afiliación a otros centros</label>
                        <textarea id="otherCentersAffiliation" name="otherCentersAffiliation" value={formData.otherCentersAffiliation} onChange={handleChange}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="otherProgramsFunding">Fondos de otros programas</label>
                        <textarea id="otherProgramsFunding" name="otherProgramsFunding" value={formData.otherProgramsFunding} onChange={handleChange}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="anidScholarshipApplication">¿Ha postulado a la beca ANID?<span style={{ color: 'red' }}> *</span></label>
                        <select
                            id="anidScholarshipApplication"
                            name="anidScholarshipApplication"
                            value={formData.anidScholarshipApplication}
                            onChange={(e) =>
                                setFormData((prevState) => ({
                                    ...prevState,
                                    anidScholarshipApplication: e.target.value,
                                }))
                            }
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="Sí, Magíster">Sí, Magíster</option>
                            <option value="Sí, Doctorado">Sí, Doctorado</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    {formData.anidScholarshipApplication === "No" && (
                        <div className={styles.formGroup}>
                            <label htmlFor="nonAnidScholarshipJustification">Justificación de la no postulación<span style={{ color: 'red' }}> *</span></label>
                            <textarea id="nonAnidScholarshipJustification" name="nonAnidScholarshipJustification" value={formData.nonAnidScholarshipJustification} onChange={handleChange} required></textarea>
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label htmlFor="ceniaParticipationActivities">Actividades de participación CENIA<span style={{ color: 'red' }}> *</span></label>
                        <textarea id="ceniaParticipationActivities" name="ceniaParticipationActivities" value={formData.ceniaParticipationActivities} onChange={handleChange} required></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="amountRequested">
                            Monto a Solicitar para la Beca<span style={{ color: 'red' }}> *</span>
                        </label>
                        <input type="number" min={0} id="amountRequested" name="amountRequested" value={formData.amountRequested} onChange={handleChange} required />
                    </div>
                    <button type="submit">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    );
};

export default NuevaSolicitudIncentivo;
