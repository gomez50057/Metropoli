// src/app/login/page.js
import React from 'react';
import Login from '@/components/auth/Login';
import Navbar from '@/components/shared/Navbar';


const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <Login />
    </div>
  );
};

export default LoginPage;
