import React from 'react';
import ZonasMetropolitanas from '@/features/teams/components/ZonasMetropolitanas';
import Navbar from '@/components/shared/Navbar';


const IntegrantesPage = async ({ searchParams }) => {
  const { zona } = await searchParams;
  const initialZone = ['ZMVM', 'ZMP', 'ZMTulancingo'].includes(zona) ? zona : undefined;
  return (
    <div>
      <Navbar />
      <ZonasMetropolitanas initialZone={initialZone} />
    </div>
  );
};

export default IntegrantesPage;
