"use client";

import React from 'react';
import CreateFormulario from '@/features/legacy-dashboard/forms/CreateFormulario';
import Navbar from '@/components/shared/Navbar';


const form = () => {
  return (
    <div>
      <Navbar />
      <CreateFormulario />

    </div>
  );
};

export default form;
