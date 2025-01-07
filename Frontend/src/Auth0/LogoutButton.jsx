import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from  '../styles/Navbar.module.css';

const LogoutButton = () => {
  const { logout } = useAuth0();
  //Boton diseñado para el cierre de sesión
  return (
    <button className={styles.logoutButton} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;