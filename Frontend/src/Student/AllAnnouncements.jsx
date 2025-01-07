import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../styles/AllAnnouncements.css";

const AllAnnouncements = () => {
  const { isLoading, isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(10);
  const [registeredAnnouncements, setRegisteredAnnouncements] = useState([]);
  const [notRegisteredAnnouncements, setNotRegisteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageVisible, setMessageVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/announcement/active`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setRegisteredAnnouncements(response.data.registeredAnnouncements);
          setNotRegisteredAnnouncements(response.data.notRegisteredAnnouncements);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching announcements:", error);
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();
  }, [isLoading, isAuthenticated, getAccessTokenSilently]);

  const toggleMessageVisibility = (message) => {
    if (messageVisible && currentMessage === message) {
      setMessageVisible(false);
      setCurrentMessage("");
    } else {
      setMessageVisible(true);
      setCurrentMessage(message);
    }
  };
  
  const handleShowMessage = (motivationMessage) => {
    setSelectedMessage({ motivationMessage });
    toggleMessageVisibility({ motivationMessage });
  };

  const allAnnouncements = [...registeredAnnouncements, ...notRegisteredAnnouncements];

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = allAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalPages = Math.ceil(allAnnouncements.length / announcementsPerPage);

  return (
    <div className="solicitudes-container">
      <Navbar />
      <h1 className="solicitudes-title">Anuncios disponibles</h1>

      {allAnnouncements.length === 0 ? (
        <p>No existen anuncios disponibles.</p>
      ) : (
        <div className="table-container">
          <table className="solicitudes-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentAnnouncements.map((announcement, index) => {
                const isRegistered = registeredAnnouncements.some(
                  (a) => a.id === announcement.id
                );
                return (
                  <tr key={index}>
                    <td>{announcement.title}</td>
                    <td>{announcement.description}</td>
                    <td>
                      {isRegistered ? (
                        <button
                          className="revisar-mensaje-button"
                          onClick={() => handleShowMessage(announcement.motivationMessage)}
                        >
                          Mostrar mensaje enviado
                        </button>
                      ) : (
                        <button
                          className="enviar-mensaje-button"
                          onClick={() => navigate(`/ReplyAnnouncement/${announcement.id}`)}
                        >
                          Enviar mensaje
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedMessage && (
        <div className="popup-background">
          <div className="popup">
            <h2>Mensaje enviado</h2>
            <p>
              <strong>Descripción:</strong> {selectedMessage.motivationMessage}
            </p>
            <button onClick={() => setSelectedMessage(null)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AllAnnouncements;
