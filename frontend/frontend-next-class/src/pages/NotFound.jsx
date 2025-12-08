import React from 'react';
import { Link } from 'react-router-dom';
import garra from '../assets/garra.png'; // Reutilizamos tus assets

const NotFound = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #00B8C8 0%, #00838F 100%)',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <img src={garra} alt="Garra" style={{ width: '100px', opacity: 0.8, marginBottom: '20px' }} />
      
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>¡Ups! Te perdiste.</h2>
      <p style={{ fontSize: '1.2rem', maxWidth: '500px', marginBottom: '40px' }}>
        La página que buscas no existe o fue movida. No te preocupes, puedes volver al camino.
      </p>

      <Link to="/" style={{
        backgroundColor: 'white',
        color: '#00838F',
        padding: '15px 40px',
        borderRadius: '30px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}>
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;