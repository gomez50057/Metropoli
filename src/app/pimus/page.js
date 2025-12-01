import React from 'react';
import Navbar from '@/components/shared/Navbar';
import HomeWebflow from "@/components/pimus/PimusHero";
// import VerticalLoopContained from "@/components/pimus/VerticalLoop";
import PimusZmpAbout from "@/components/pimus/PimusZmpAbout";
import PimusJustificacionAlcance from "@/components/pimus/PimusDobleSeccion";
import HaptichashSlider from "@/components/pimus/HaptichashSlider";
import PimusZmpGoals from "@/components/pimus/PimusZmpGoals";
import PimusZmpBenefits from "@/components/pimus/PimusZmpBenefits";
import Pimuskpis from "@/components/pimus/Pimuskpis";

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
      < HaptichashSlider/>
      <PimusZmpGoals />
      <PimusZmpBenefits />
      <Pimuskpis />
    </div>
  );
};

export default PIMUS_ZMP_Page;