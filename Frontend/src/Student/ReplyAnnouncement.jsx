import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Navbar from "../Commons/Navbar";
import styles from '../styles/ReplyAnuncio.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const ReplyAnnouncement = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const [motivationMessage, setMotivationMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const { announcementId } = useParams();
  const navigate = useNavigate();

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
      if (userRole !== 2) {
        navigate("/unauthorized");
      }
    }
  }, [isLoading, loadingRole, userRole, navigate]);

  const handleSubmit = async () => {
    if (!motivationMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const accessToken = await getAccessTokenSilently();
      const url = `${import.meta.env.VITE_BACKEND_URL}/userAnnouncement/${announcementId}/register`;
      await axios.post(
        url,
        { userId: userRole, motivationMessage: motivationMessage },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert('Te registraste exitosamente en el anuncio.');
      navigate("/AllAnnouncements");
    } catch (error) {
      console.error('Error al registrarse en el anuncio:', error.response?.data || error.message);
      alert('Ocurrió un error al registrarse en el anuncio.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.backgroundReplyAnuncio}>
      <Navbar />
      <div className={styles.containerReplyAnuncio}>
        <div className={styles.ReplyannouncementFormAnuncio}>
          <button className={styles.profileButton} onClick={() => navigate('/AllAnnouncements')}><strong>&lt;</strong></button>
          <h3>Enviar motivación</h3>
          <div className={styles.messageReplyAnuncios}>
            <label>Descripción del mensaje: <span style={{ color: 'red' }}> *</span></label>
            <textarea
              placeholder="Escribe aquí tu mensaje de motivación..."
              value={motivationMessage}
              onChange={(e) => setMotivationMessage(e.target.value)}
            />
          </div>
          <button
            className={styles.sendButtonReplyAnuncios}
            disabled={!motivationMessage.trim() || isSending}
            onClick={handleSubmit}
          >
            {isSending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyAnnouncement;
