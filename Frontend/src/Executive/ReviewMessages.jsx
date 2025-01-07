import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Navbar from "../Commons/Navbar";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ReviewMessages.css';

const ReviewMessages = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [loading, setLoading] = useState(true);
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);

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
    if (!isLoading && !loadingRole) {
      if (userRole !== 1) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loadingRole, userRole, navigate]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (isSending) return;

      setIsSending(true);
      try {
        const accessToken = await getAccessTokenSilently();
        const url = `${import.meta.env.VITE_BACKEND_URL}/userAnnouncement/${announcementId}/students`;
        const response = await axios.get(
          url,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const students = response.data.students || [];
        setMessages(students);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      } finally {
        setIsSending(false);
      }
    };

    if (!isLoading && !loadingRole && userRole === 1) {
      fetchAnnouncements();
    }
  }, [isLoading, loadingRole, userRole, announcementId, getAccessTokenSilently]);

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  return (
    <div className="backgroundAnuncio">
      <Navbar />
      <div className="containerAnuncio">
        <div className="announcementFormAnuncio">
          <button className="profileButton" onClick={() => navigate('/ManageAnuncios')}><strong>&lt;</strong></button>
          <h3>Mensajes</h3>
          <div className="table-container">
            {messages.length > 0 ? (
              <table className="solicitudes-table">
                <thead>
                  <tr>
                    <th>Nombre de Usuario</th>
                    <th>Correo Electrónico</th>
                    <th>Mensaje de Motivación</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentMessages.map((student, index) => (
                    <tr key={index}>
                      <td>{student.username}</td>
                      <td>{student.email}</td>
                      <td>{student.UserAnnouncement.motivationMessage}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se han recibido mensajes por este anuncio.</p>
            )}
          </div>
          <div className="pagination-review">
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
      </div>
    </div>
  );
};

export default ReviewMessages;
