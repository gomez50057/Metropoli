"use client";
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const imgBasePath = "https://bibliotecadigitaluplaph.hidalgo.gob.mx/img_banco/";
const img = "/img/";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/auth/inicio-sesion/`, { username, password });
      if (response.data.status === 'ok') {
        // Guardar el token de autenticación en las cookies
        document.cookie = `authToken=${response.data.token}; path=/; SameSite=Lax; Secure`;

        // Guardar otros datos del usuario en localStorage
        localStorage.setItem('userRole', response.data.group);
        localStorage.setItem('userName', response.data.username);
        localStorage.setItem('userState', response.data.estado);
        localStorage.setItem('userCommission', response.data.comision);

        // Redirigir al dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id='login' className="container_login">
      <div className="background-login" />
      <div className="background-login-img">
        <img src={`${img}backlogin.png`} alt="img_representativa" />
      </div>
      <div className="login_txt">
        <img src={`${imgBasePath}estrella.webp`} alt="Imagen representativa" />
        <p>Inicia Sesión</p>
        <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">
          <div className="input-container">
            <input
              type="text"
              id="username"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <img
              className="input-img"
              src={showPassword ? `${imgBasePath}password_visible.webp` : `${imgBasePath}password.webp`}
              alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={togglePasswordVisibility}
            />
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          {loading ? (
            <div className="loading-indicator">Cargando...</div>
          ) : (
            <button type="submit" disabled={loading}>INGRESAR</button>
          )}
        </form>
        {/* <p>¿No tienes una cuenta? <a href="/" className="link-registrarse">REGÍSTRATE</a></p> */}
      </div>
    </section>
  );
};

export default Login;
