import React from 'react';
import Navbar from "./Navbar";

const Unauthorized = () => {
    const textColor = "#090E50"; 
    //Pagina que se redirige cuando no se tiene acceso por no cumplimiento de rol
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
            <Navbar />
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ color: textColor }}>Sin autorización</h1>
                <p style={{ color: textColor }}>No tienes permisos para acceder a esta página.</p>
            </div>
        </div>
    );
};

export default Unauthorized;
