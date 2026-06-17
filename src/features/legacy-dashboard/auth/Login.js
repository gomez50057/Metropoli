"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { apiOriginUrl, externalAssetUrl } from '@/config/api';
import loginStyles from './Login.module.css';

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
    try {
      const response = await axios.post(apiOriginUrl('/auth/inicio-sesion/'), { username, password });
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
    <section id='login' className={loginStyles["container_login"]}>
      <div className={loginStyles["background-login"]} />
      <div className={loginStyles["background-login-img"]}>
        <img src={`${img}backlogin.png`} alt="img_representativa" />
      </div>
      <div className={loginStyles["login_txt"]}>
        <img src={externalAssetUrl('/img_banco/estrella.webp')} alt="Imagen representativa" />
        <p>Inicia Sesión</p>
        <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">
          <div className={loginStyles["input-container"]}>
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
          <div className={loginStyles["input-container"]}>
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
              className={loginStyles["input-img"]}
              src={externalAssetUrl(showPassword ? '/img_banco/password_visible.webp' : '/img_banco/password.webp')}
              alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={togglePasswordVisibility}
            />
          </div>
          {error && <div className={loginStyles["error-message"]} role="alert">{error}</div>}
          {loading ? (
            <div className={loginStyles["loading-indicator"]}>Cargando...</div>
          ) : (
            <button type="submit" disabled={loading}>INGRESAR</button>
          )}
        </form>
        {/* <p>¿No tienes una cuenta? <a href="/" className={loginStyles["link-registrarse"]}>REGÍSTRATE</a></p> */}
      </div>
    </section>
  );
};

export default Login;
