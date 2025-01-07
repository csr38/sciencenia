import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import '../../styles/VerSolicitudRecursos.css';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../Commons/Navbar";
import LoadingSpinner from "../../Commons/LoadingSpinner";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const VerMiSolicitud = () => {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    let { id } = useParams();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userBack, setUserBack] = useState(null);
    const [showPopup, setShowPopup] = useState(false); 
    const [editData, setEditData] = useState({
        startDate: "",
        durationPeriod: "",
        destination: "",
        conferenceName: "",
        files: [], 
    });

    const formatNumber = (number) => { // REVISAR
        const formattedNumber = new Intl.NumberFormat("es-CL").format(number);
        return `$${formattedNumber} CLP`;
    };

    const togglePopup = () => setShowPopup(!showPopup);

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
                    setUserBack(response.data);
                    setUserRole(response.data.roleId);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [isLoading, user, getAccessTokenSilently]);

    useEffect(() => {
        const fetchRequestData = async () => {
            if (!isLoading && user) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    const url = `${import.meta.env.VITE_BACKEND_URL}/request/getById/${id}`;
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
    
                    setRequest(response.data); 
                    setEditData({
                        startDate: response.data.startDate || "",
                        durationPeriod: response.data.durationPeriod || "",
                        destination: response.data.destination || "",
                        conferenceName: response.data.conferenceName || "",
                    });
                    console.log("Solicitud fetched successfully:", response.data); 
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching request data:", error);
                    setLoading(false);
                }
            }
        };
    
        fetchRequestData();
    }, [isLoading, user, getAccessTokenSilently, id]);
    

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); 
    
        try {
            const accessToken = await getAccessTokenSilently();
    

            if (request.filesToRemove && request.filesToRemove.length > 0) {
                console.log("Removing files...");
                await Promise.all(
                    request.filesToRemove.map((fileId) =>
                        removeFileFromRequest(id, fileId)
                    )
                );
                console.log("Files removed successfully.");
            }
    

            let attachedFiles = [];
            if (editData.files && editData.files.length > 0) {
                console.log("Attaching files...");
                attachedFiles = await attachFilesToRequest(id, editData.files);
                console.log("Files attached successfully.");
            }
    

            const payload = {
                startDate: editData.startDate,
                durationPeriod: editData.durationPeriod,
                destination: editData.destination,
                conferenceName: editData.conferenceName,
            };
    
            console.log("Sending JSON payload:", payload);
    
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/request/${id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log("Request updated successfully:", response.data);
    
            setRequest((prev) => ({
                ...prev,
                files: [
                    ...prev.files.filter(
                        (file) => !request.filesToRemove.includes(file.id)
                    ),
                    ...attachedFiles, 
                ],
                ...response.data, 
            }));
    
            alert("Solicitud actualizada con éxito");
            setShowPopup(false);
        } catch (error) {
            console.error("Error updating request:", error);
            alert(`Error: ${error.response?.data?.message || "Failed to update the request"}`);
        } finally {
            setIsSubmitting(false); 
        }
    };

    const attachFilesToRequest = async (requestId, files) => {
        const fileFormData = new FormData();
        files.forEach((file) => {
            fileFormData.append("files", file);
        });

        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/request/${requestId}/attachFiles`;

            const response = await axios.post(url, fileFormData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log("Files attached successfully:", response.data.files);
            return response.data.files; 
        } catch (error) {
            console.error("Error attaching files:", error);
            throw error;
        }
    };

    const removeFileFromRequest = async (requestId, fileId) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const url = `${import.meta.env.VITE_BACKEND_URL}/request/${requestId}/removeFile/${fileId}`;

            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log("File removed successfully:", response.data);
        } catch (error) {
            console.error("Error removing file:", error);
            throw error;
        }
    };

    
    
    
    if (isLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='background-card-recursos'>
            <Navbar />
            <div className='card-recursos'>
                <div className="card-content-recursos">
                <button className="profileButton" onClick={() => navigate(-1)}><strong>&lt;</strong></button>
                    <div className='card-title-recursos'>
                        <h1> Solicitud de Recursos</h1>
                        {request ? (
                            <>
                                <h2 className="sm-recursos">Solicitud #{request.id}</h2>
                                <p className="sm-recursos"><strong>Estado:</strong> {request.status}</p>
                                <div>
                                    <p className="sm"><strong>Nombre Aplicante:</strong> {userBack?.names} {userBack?.lastName}</p>
                                </div>
                            </>
                        ) : (
                            <p>No se encontró la solicitud.</p>
                        )}
                    </div>
                    <div className='card-two-col'>
                        <div>
                            <p className="sm"><strong>Motivo:</strong></p>
                            <p className="sm">{request.purpose}</p>
                        </div>
                        {request.purpose === "Asistencia a conferencia" && (
                            <div>
                                <p className="sm"><strong>Nombre de la Conferencia:</strong></p>
                                <p className="sm">{request.conferenceName || "No especificado"}</p>
                            </div>
                        )}
                    </div>
                    <div className='card-two-col'>
                        <div className="smb">
                            <p className="sm"><strong>Destino:</strong></p>
                            <p className="sm">{request.destination}</p>
                        </div>
                        <div>
                            <p className="sm"><strong>Duración del Periodo:</strong></p>
                            <p className="sm">{request.durationPeriod}</p>
                        </div>
                        <div>
                            <p className="sm"><strong>Financiamiento Solicitado:</strong></p>
                            <p className="sm">{request.financingType.join(", ")}</p>
                        </div>
                    </div>
                    <div className='card-two-col'>
                        <div className="smb">
                            <p className="sm"><strong>Financiamiento externo:</strong></p>
                            <p className="sm">{request.outsideFinancing ? request.outsideFinancingSponsors : "no"}</p>
                        </div>
                        <div>
                            <p className="sm"><strong>Monto adicional Solicitado:</strong></p>
                            <p className="sm">{request.amountRequested ? formatNumber(request.amountRequested) : "No informado"}</p>
                        </div>
                    </div>
                    <div className='card-two-col'>
                        <div className="smb">
                            <p className="sm"><strong>Archivos Adjuntos:</strong></p>
                            {request?.files && request.files.length > 0 ? (
                                request.files.map((file, index) => (
                                    <div key={index} style={{ marginBottom: "5px" }}>
                                        <span
                                            onClick={() => downloadFile(file.id)}
                                            style={{
                                                color: "blue",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            {file.fileName}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No hay archivos adjuntos.</p>
                            )}
                        </div>
                    </div>
                    <div className='card-two-col'>
                        <div>
                            <p className="sfm"><strong>Motivo de aprobación / rechazo:</strong></p>
                            <p className="sm">{request.response ? request.response : 'No se ha procesado la solicitud aún'}</p>
                        </div>
                        <div>
                            <p className="sfm"><strong>Monto aprobado:</strong></p>
                            <p className="sm">{request.amountGranted ? formatNumber(request.amountGranted) : 'No se ha procesado la solicitud aún o fue rechazada'}</p>
                        </div>
                    </div>
                    {request.status === "Pendiente" && (
                        <button className="profile-button" onClick={togglePopup}>
                            Editar Solicitud
                        </button>
                    )}
                    
                </div>
            </div>

            {showPopup && (
                <div className="popup-background">
                    <div className="popup">
                        {isSubmitting && <LoadingSpinner />} 
                        
                        {!isSubmitting && ( 
                            <>
                                <h2>Editar Solicitud</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="startDate">Fecha de Inicio:</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={editData.startDate}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    startDate: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="durationPeriod">Duración del Periodo:</label>
                                        <input
                                            type="text"
                                            id="durationPeriod"
                                            name="durationPeriod"
                                            value={editData.durationPeriod}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    durationPeriod: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="destination">Destino:</label>
                                        <input
                                            type="text"
                                            id="destination"
                                            name="destination"
                                            value={editData.destination}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    destination: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    {request.purpose === "Asistencia a conferencia" && (
                                        <div className="form-group">
                                            <label htmlFor="conferenceName">Nombre de la Conferencia:</label>
                                            <input
                                                type="text"
                                                id="conferenceName"
                                                name="conferenceName"
                                                value={editData.conferenceName}
                                                onChange={(e) =>
                                                    setEditData((prev) => ({
                                                        ...prev,
                                                        conferenceName: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Archivos Adjuntos:</label>
                                        {request?.files && request.files.length > 0 ? (
                                            request.files.map((file, index) => {
                                                const isMarkedForRemoval =
                                                    request.filesToRemove?.includes(file.id) || false;

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
                                                                setRequest((prev) => {
                                                                    const filesToRemove = prev.filesToRemove || [];
                                                                    // Toggle file removal
                                                                    return {
                                                                        ...prev,
                                                                        filesToRemove: isMarkedForRemoval
                                                                            ? filesToRemove.filter(
                                                                                (id) => id !== file.id
                                                                            )
                                                                            : [...filesToRemove, file.id],
                                                                    };
                                                                })
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerMiSolicitud;
