import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import '../../styles/VerSolicitudIncentivos.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../Commons/Navbar";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const VerMiSolicitudIncentivos = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    let { id } = useParams();

    const [scholarship, setScholarship] = useState({
        files: [], // Existing files
        filesToRemove: [], // Files marked for removal
    });
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // For popup visibility
    const [editData, setEditData] = useState({
        graduationDate: "",
        scientificProduction: "",
        files: [], // New files to attach
    });

    

    const togglePopup = () => setShowPopup(!showPopup); // Toggles popup visibility

    const formatNumber = (number) => {
        const formattedNumber = new Intl.NumberFormat("es-CL").format(number);
        return `$${formattedNumber} CLP`;
    };

    const downloadFile = async (fileId) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/files/${fileId}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            const { url: fileUrl, fileName } = response.data;
    
            const link = document.createElement('a');
            link.href = fileUrl; // Use the URL provided by the backend
            link.setAttribute('download', fileName); // Use the fileName provided by the backend
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error al descargar el archivo. Inténtalo de nuevo.');
        }
    };
    

    useEffect(() => {
        const fetchRequestData = async () => {
            if (!isLoading && user) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship/${id}`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setScholarship({
                        ...response.data,
                        filesToRemove: [], // Initialize empty array for files to remove
                    });
                    setEditData({
                        graduationDate: new Date(response.data.graduationDate).toISOString().split('T')[0],
                        scientificProduction: response.data.scientificProduction,
                        files: [], // Reset files to attach
                    });
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching request data:', error);
                    setLoading(false);
                }
            }
        };
    
        fetchRequestData();
    }, [isLoading, user, getAccessTokenSilently, id]);
    

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently();
    
            // Step 1: Remove Files
            if (scholarship.filesToRemove.length > 0) {
                await Promise.all(
                    scholarship.filesToRemove.map((fileId) =>
                        removeFileFromScholarship(fileId)
                    )
                );
            }
    
            // Step 2: Attach New Files
            let attachedFiles = [];
            if (editData.files.length > 0) {
                attachedFiles = await attachFilesToScholarship(editData.files);
            }
    
            // Step 3: Update Other Fields
            const updatedData = {
                graduationDate: editData.graduationDate,
                scientificProduction: editData.scientificProduction,
            };
    
            const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship/${id}`;
            await axios.patch(url, updatedData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
    
            // Step 4: Update State
            setScholarship((prev) => ({
                ...prev,
                files: [
                    ...prev.files.filter(
                        (file) => !prev.filesToRemove.includes(file.id)
                    ), // Keep files not marked for removal
                    ...attachedFiles, // Add newly attached files
                ],
                ...updatedData,
            }));
    
            alert("Información actualizada con éxito.");
            setShowPopup(false);
        } catch (error) {
            console.error("Error updating scholarship:", error);
            alert("Error al actualizar la información.");
        }
    };
    

    const attachFilesToScholarship = async (files) => {
        const fileFormData = new FormData();
        files.forEach((file) => fileFormData.append("files", file));
    
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship/${id}/attachFiles`;
            const response = await axios.post(url, fileFormData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log("Files attached successfully:", response.data.files);
            return response.data.files; // Return newly attached files
        } catch (error) {
            console.error("Error attaching files:", error);
            throw error;
        }
    };

    const removeFileFromScholarship = async (fileId) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/scholarship/${id}/removeFile/${fileId}`;
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log("File removed successfully");
        } catch (error) {
            console.error("Error removing file:", error);
            throw error;
        }
    };
    

    if (isLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='background-card'>
            <Navbar />
            <div className='card'>
                <div className="card-content">
                    <button className="profileButton" onClick={() => navigate(-1)}><strong>&lt;</strong></button>
                    <div className='card-title'>
                        <h1> Solicitud de Incentivos</h1>
                        {scholarship ? (
                            <>
                                <h2 className="sm">Solicitud #{scholarship.id}</h2>
                                <p className="sm"><strong>Estado:</strong> {scholarship.status}</p>
                                {
                                    scholarship.status === 'Aprobada' || scholarship.status === 'Rechazada' ? (
                                        <p className="sm">
                                            <strong>Motivo Aceptación / Rechazo: </strong>
                                            {scholarship.response ?? 'No informado'}
                                        </p>
                                    ) : (<p></p>)
                                }
                                <p className="sm"><strong>Correo:</strong> {scholarship.student.email ?? ' No informado'}</p>
                                <p className="sm">
                                    <strong>Fecha de Graduación:</strong> {new Date(scholarship.graduationDate).toLocaleDateString('es-CL') ?? ' No informada'}
                                </p>
                                <p className="sm">
                                    <strong>Participacion actividades Cenia: </strong>
                                    {scholarship.ceniaParticipationActivities ?? ' Sin respuesta'}
                                </p>
                                <p className="sm">
                                    <strong>Presupuesto Solicitado: </strong>
                                    {scholarship.amountRequested ? formatNumber(scholarship.amountRequested) : ' No especificado'}
                                </p>
                                <p className="sm">
                                    <strong>Presupuesto Otorgado: </strong>
                                    {scholarship.amountGranted ? formatNumber(scholarship.amountGranted) : ' No especificado'}
                                </p>
                                <p className="sm"><strong>Producción Científica: </strong> {scholarship.scientificProduction ?? ' No informada'}</p>
                                <div className="sm">
                                    <strong>Archivo Adjunto: </strong>
                                    {scholarship.files && scholarship.files.length > 0 ? (
                                        <div>
                                            {scholarship.files.map((file, index) => (
                                                <div key={index}>
                                                    <a 
                                                        href="#" 
                                                        onClick={() => downloadFile(file.id)} 
                                                        style={{ color: '#1a0dab', textDecoration: 'underline', cursor: 'pointer' }}
                                                    >
                                                        {file.fileName}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No hay archivo adjunto.</p>
                                    )}
                                </div>
                                {scholarship.status === "Pendiente" && ( // Display the button only for "Pendiente" status
                                    <button className="profile-button" onClick={togglePopup}>
                                        Editar Información
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>No se encontró la solicitud.</p>
                        )}
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="popup-background">
                    <div className="popup">
                        <h2>Editar Información</h2>
                        <form onSubmit={handleEditSubmit}>
                            {/* Graduation Date */}
                            <div className="form-group">
                                <label htmlFor="graduationDate">Fecha de Graduación:</label>
                                <input
                                    type="date"
                                    id="graduationDate"
                                    name="graduationDate"
                                    value={editData.graduationDate}
                                    onChange={(e) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            graduationDate: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>

                            {/* Scientific Production */}
                            <div className="form-group">
                                <label htmlFor="scientificProduction">Producción Científica:</label>
                                <textarea
                                    id="scientificProduction"
                                    name="scientificProduction"
                                    value={editData.scientificProduction}
                                    onChange={(e) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            scientificProduction: e.target.value,
                                        }))
                                    }
                                    required
                                ></textarea>
                            </div>

                            {/* Existing Files with Remove Option */}
                            <div className="form-group">
                                <label>Archivos Adjuntos:</label>
                                {scholarship?.files && scholarship.files.length > 0 ? (
                                    scholarship.files.map((file, index) => {
                                        const isMarkedForRemoval =
                                            scholarship.filesToRemove?.includes(file.id);

                                        return (
                                            <div key={index} style={{ marginBottom: "5px" }}>
                                                <span
                                                    style={{
                                                        marginRight: "10px",
                                                        color: "blue",
                                                        cursor: "pointer",
                                                        textDecoration: "underline",
                                                    }}
                                                    onClick={() => downloadFile(file.id)}
                                                >
                                                    {file.fileName}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setScholarship((prev) => ({
                                                            ...prev,
                                                            filesToRemove: isMarkedForRemoval
                                                                ? prev.filesToRemove.filter(
                                                                    (id) => id !== file.id
                                                                ) // Undo removal
                                                                : [...(prev.filesToRemove || []), file.id], // Mark for removal
                                                        }))
                                                    }
                                                    style={{
                                                        color: isMarkedForRemoval ? "gray" : "red",
                                                        cursor: "pointer",
                                                        border: "none",
                                                        background: "none",
                                                    }}
                                                >
                                                    {isMarkedForRemoval ? "Undo Remove" : "Remove"}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No hay archivos adjuntos.</p>
                                )}
                            </div>

                            {/* File Upload Section */}
                            <div className="form-group">
                                <label htmlFor="files">Agregar Archivos:</label>
                                <input
                                    type="file"
                                    id="files"
                                    name="files"
                                    multiple
                                    onChange={(e) =>
                                        setEditData((prev) => ({
                                            ...prev,
                                            files: Array.from(e.target.files),
                                        }))
                                    }
                                />
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <button type="submit" className="profile-button">
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={togglePopup}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default VerMiSolicitudIncentivos;
