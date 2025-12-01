import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/PMIU_ZMP/Hero';
import BehindPlan from '@/components/PMIU_ZMP/BehindPlan';
import CountsPanel from '@/components/PMIU_ZMP/CountsPanel';
import MunicipiosPromoSlider from "@/components/PMIU_ZMP/MunicipiosPromoSlider";
import { MUNICIPIOS } from "@/utils/municipios";
import HaptichashSlider from "@/components/PMIU_ZMP/HaptichashSlider";


const pmiu_zmp = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <BehindPlan />
      <HaptichashSlider />
      <CountsPanel />
      <MunicipiosPromoSlider items={MUNICIPIOS} />
    </div>
  );
};

export default pmiu_zmp;
