import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Hero from '@/features/pmiu-zmp/components/Hero';
import BehindPlan from '@/features/pmiu-zmp/components/BehindPlan';
import CountsPanel from '@/features/pmiu-zmp/components/CountsPanel';
import MunicipiosPromoSlider from "@/features/pmiu-zmp/components/MunicipiosPromoSlider";
import { MUNICIPIOS } from "@/data/municipios";
import HaptichashSlider from "@/features/pmiu-zmp/components/HaptichashSlider";
import WorkshopResults from "@/features/pmiu-zmp/components/WorkshopResults/WorkshopResults";


const pmiu_zmp = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <BehindPlan />
      <WorkshopResults />
      <HaptichashSlider />
      <CountsPanel />
      <MunicipiosPromoSlider items={MUNICIPIOS} />
    </div>
  );
};

export default pmiu_zmp;
