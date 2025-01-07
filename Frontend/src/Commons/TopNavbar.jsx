import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from '../styles/Navbar.module.css';
import LogoutButton from '../Auth0/LogoutButton';
import axios from "axios";
import 'font-awesome/css/font-awesome.min.css';

function TopNavbar() {
  const { isAuthenticated, user, getAccessTokenSilently, logout } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Validar el token y cerrar sesión si no es válido
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (isAuthenticated) {
          await getAccessTokenSilently();
        }
      } catch (error) {
        console.error("El token ha expirado o no es válido:", error);
        logout({ returnTo: window.location.origin }); 
      }
    };

    validateToken();
  }, [isAuthenticated, getAccessTokenSilently, logout]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserRole/${user.email}`);
          setUserRole(response.data.roleId);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [user, isAuthenticated]);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState); 
  };

  return (
    <nav className={styles.topNabvar}>
      <div>
        <a href="/" className={styles.logo}>SCIENCENIA HUB</a>
      </div>
      <div className={styles.menuToggle} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`${styles.menuNav} ${menuOpen ? styles.active : ''}`}>
        {userRole !== 1 && userRole !== 2 && (
          <>
            <li className={styles.menuItem}>
              <a href="/Observatorio" className={styles.menuLink}>Observatorio</a>
            </li>
            <li className={styles.menuItem}>
              <a href="/Investigadores" className={styles.menuLink}>Investigadores</a>
            </li>
          </>
        )}

        {isAuthenticated && (
          <>

            {userRole === 1 && (
              <>
                <li className={styles.dropdown}>
                  <span className={styles.dropbtn}>Observatorio</span>
                  <ul className={styles.dropdownContent}>
                    <li className={styles.dropdownSubItem}>
                      <a href="/Observatorio">Ir al observatorio</a>
                    </li>
                    <li className={styles.dropdownSubItem}>
                      <a href="/UploadResearch">Agregar Producción científica</a>
                    </li>
                  </ul>
                </li>

                <li className={styles.dropdown}>
                  <span className={styles.dropbtn}>Usuarios</span>
                  <ul className={styles.dropdownContent}>
                    <li className={styles.dropdownSubItem}>
                      <a href="/UploadStudent">Agregar Estudiantes</a>
                    </li>
                    <li>
                      <a href="/UploadResearcher">Agregar Investigadores</a>
                    </li>
                    <li>
                      <a href="/EditProfiles">Editar Perfiles</a>
                    </li>
                  </ul>
                </li>

                <li className={styles.dropdown}>
                  <span className={styles.dropbtn}>Solicitudes</span>
                  <ul className={styles.dropdownContent}>
                    <li className={styles.dropdownSubItem}>
                      <a href="/ManejarSolicitudesFondos">Solicitudes de Recursos para Viajes</a>
                    </li>
                    <li>
                      <a href="/ProcesosPostulacionIncentivos">Solicitudes de Becas</a>
                    </li>
                  </ul>
                </li>

                <li className={styles.menuItem}>
                  <a href="/Investigadores" className={styles.menuLink}>Investigadores</a>
                </li>
                <li className={styles.menuItem}>
                  <a href="/ManageAnuncios" className={styles.menuLink}>Anuncios</a>
                </li>
                <li className={styles.dropdown}>
                  <span className={styles.dropbtn}>Presupuestos</span>
                  <ul className={styles.dropdownContent}>
                    <li className={styles.dropdownSubItem}>
                      <a href="/Presupuestos">Crear Presupuesto</a>
                    </li>
                    <li>
                      <a href="/VerPresupuestos">Ver Presupuestos vigentes</a>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {userRole === 2 && (
              <>
                <li className={styles.menuItem}>
                  <a href="/Observatorio" className={styles.menuLink}>Observatorio</a>
                </li>
                <li className={styles.dropdown}>
                  <span className={styles.dropbtn}>Solicitudes</span>
                  <ul className={styles.dropdownContent}>
                    <li className={styles.dropdownSubItem}>
                      <span className={styles.dropbtn}>Solicitudes de Recursos para Viajes</span>
                      <ul className={styles.subDropdownContent}>
                        <li><a href="/MisSolicitudes">Mis Solicitudes</a></li>
                        <li><a href="/NuevaSolicitud">Nueva Solicitud</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="/SolicitudesDeIncentivos">Solicitudes de Becas</a>
                    </li>
                  </ul>
                </li>
                <li className={styles.menuItem}>
                  <a href="/Investigadores" className={styles.menuLink}>Investigadores</a>
                </li>
                <li className={styles.menuItem}>
                  <a href="/AllAnnouncements" className={styles.menuLink}>Anuncios</a>
                </li>
                <li>
                  <a href="/StudentProfile">Mi Perfil</a>
                </li>
              </>
            )}

            <li>
              <LogoutButton />
            </li>
          </>
        )}

        {!isAuthenticated && (
          <button className={styles.LoginButton} onClick={() => window.location.href = '/authlogin'}>
            Iniciar Sesión
          </button>
        )}
      </ul>
    </nav>
  );
}

export default TopNavbar;
