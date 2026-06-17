import React from 'react';
import Navbar from '@/components/shared/Navbar';
import HomeWebflow from "@/features/pimus/components/PimusHero";
// import VerticalLoopContained from "@/features/pimus/components/VerticalLoop";
import PimusZmpAbout from "@/features/pimus/components/PimusZmpAbout";
import PimusJustificacionAlcance from "@/features/pimus/components/PimusDobleSeccion";
import HaptichashSlider from "@/features/pimus/components/HaptichashSlider";
import PimusZmpGoals from "@/features/pimus/components/PimusZmpGoals";
import PimusZmpBenefits from "@/features/pimus/components/PimusZmpBenefits";
// import Pimuskpis from "@/features/pimus/components/Pimuskpis";
import DataZMP from "@/features/pimus/components/DataZMP";

const PIMUS_ZMP_Page = () => {
  return (
    <div>
      <Navbar />
      <HomeWebflow />
      {/* <VerticalLoopContained
        fullscreen={true}
        showAfterSpacer={true}
      /> */}
      <PimusZmpAbout />
      <PimusJustificacionAlcance />
      <HaptichashSlider/>
      <PimusZmpGoals />
      <PimusZmpBenefits />
      {/* <Pimuskpis /> */}
      <DataZMP />
    </div>
  );
};

export default PIMUS_ZMP_Page;