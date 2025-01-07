import React, { useEffect, useState } from "react";
import Navbar from "../Commons/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/ManageAnuncios.css';

const ManageAnuncios = () => {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(10);
  const [isSending, setIsSending] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
    if (!isLoading && !loading && !loadingRole && userRole) {
        if (userRole !== 1) {
            navigate("/unauthorized");

        }
    }
  }, [isLoading, loading, loadingRole, userRole, navigate]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/announcement`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const sortedAnnouncements = response.data.sort((a, b) => a.id - b.id);

          setAnnouncements(sortedAnnouncements);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching announcements:", error);
          setLoading(false);
        }
      }
    };
    fetchAnnouncements();
  }, [isLoading, isAuthenticated, getAccessTokenSilently]);

  const toggleAnnouncementState = async (id, currentState) => {
    if (currentState) {
      alert("No se puede reabrir un anuncio cerrado.");
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const url = `${import.meta.env.VITE_BACKEND_URL}/announcement/${id}/close`;
      await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === id
            ? { ...announcement, isClosed: !currentState }
            : announcement
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado del anuncio.");
    }
  };

  const deleteAnnouncement = async (id) => {
    const previousAnnouncements = [...announcements];

    setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
  
    try {
      const accessToken = await getAccessTokenSilently();
      const url = `${import.meta.env.VITE_BACKEND_URL}/announcement/${id}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("Anuncio eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el anuncio:", error);
      alert("No se pudo eliminar el anuncio. Intente de nuevo.");
    }
  };
  

  const handleDeleteConfirmation = (id) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el anuncio ${id}?`);
    if (confirmDelete) {
      deleteAnnouncement(id);
    }
    setDropdownVisible(null); 
  };
  
  const openEditModal = (announcement) => {
    setEditTitle(announcement.title);
    setEditDescription(announcement.description);
    setCurrentEditId(announcement.id);
    setEditModalVisible(true);
    setDropdownVisible(null); 
  };
  
  const handleNavigate = (path) => {
    setDropdownVisible(null); 
    navigate(path); 
  };
  

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditTitle("");
    setEditDescription("");
    setCurrentEditId(null);
  };

  const handleEditSubmit = async () => {
    if (!editTitle.trim() || !editDescription.trim() || isSending) {
      alert("Título y descripción son obligatorios.");
      return;
    }

    setIsSending(true);

    try {
      const accessToken = await getAccessTokenSilently();
      const url = `${import.meta.env.VITE_BACKEND_URL}/announcement/${currentEditId}`;
      await axios.patch(
        url,
        { title: editTitle, description: editDescription },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === currentEditId
            ? { ...announcement, title: editTitle, description: editDescription }
            : announcement
        )
      );

      alert("Anuncio editado con éxito.");
      closeEditModal();
    } catch (error) {
      console.error("Error al editar el anuncio:", error.response?.data || error.message);
      alert("Error al editar el anuncio.");
    } finally {
      setIsSending(false);
    }
  };

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  



  return (
    <div className="anunciosContainer">
      <Navbar />
      <h1 className="anunciosTitle">Anuncios</h1>
      <button
        className="createAnuncioBtn"
        onClick={() => navigate("/CrearAnuncio")}
      >
        Crear Nuevo Anuncio
      </button>
      <div className="table-container-anuncios">
        <table className="anuncios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Tipo de estudiante</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAnnouncements.map((announcement, index) => (
              <tr key={index}>
                <td>{announcement.id}</td>
                <td>{announcement.title}</td>
                <td>{announcement.description}</td>
                <td>{announcement.targetAudiences.join(', ')}</td>
                <td>
                  <button
                    className={`toggleButton ${
                      announcement.isClosed ? 'closed' : 'open'
                    }`}
                    onClick={() =>
                      toggleAnnouncementState(
                        announcement.id,
                        announcement.isClosed
                      )
                    }
                  >
                    {announcement.isClosed ? "Cerrado" : "Abierto"}
                  </button>
                </td>
                <td>
                  <div className="dropdownContainer">
                    <button className="dropdownButton" onClick={() => toggleDropdown(index)}>
                      &#8230;
                    </button>
                    {dropdownVisible === index && (
                      <div className="dropdownMenu">
                      <button onClick={() => handleNavigate(`/ReviewMessages/${announcement.id}`)}>
                        Revisar mensajes
                      </button>
                      <button onClick={() => openEditModal(announcement)}>
                        Editar
                      </button>
                      <button onClick={() => handleDeleteConfirmation(announcement.id)}>
                        Eliminar
                      </button>
                    </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

      {editModalVisible && (
        <div className="popup-background">
          <div className="popup">
            <h2>Editar Anuncio</h2>
            <div className="form-group">
              <label htmlFor="title">Título:</label>
              <input
                type="text"
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descripción:</label>
              <textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <button
              className="profile-button"
              onClick={handleEditSubmit}
              disabled={isSending}
            >
              Guardar Cambios
            </button>
            <button
              className="cancel-button"
              onClick={closeEditModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnuncios;
