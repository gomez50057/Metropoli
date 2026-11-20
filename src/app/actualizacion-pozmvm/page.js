import Navbar from '@/components/shared/Navbar';
import Hero from "@/features/actualizacion-pozmvm/components/Hero";
import SplitSection from "@/features/actualizacion-pozmvm/components/SplitSection";
import AntecedentesSection from "@/features/actualizacion-pozmvm/components/AntecedentesSection";
import TransverseAxles from "@/features/actualizacion-pozmvm/components/TransverseAxles";
import GuidingPrinciples from "@/features/actualizacion-pozmvm/components/GuidingPrinciples";
import TalleresCenterSlider from "@/features/actualizacion-pozmvm/components/TalleresCenterSlider";
import ChipStatus from "@/features/actualizacion-pozmvm/components/ChipStatus";
import FeaturedNews from "@/features/actualizacion-pozmvm/components/FeaturedNews";

export default function PagePOZMVM() {
  return (
    <>
      <Navbar />
      <Hero />
      <SplitSection />
      <AntecedentesSection />
      <TransverseAxles />
      <GuidingPrinciples />
      <TalleresCenterSlider />
      <FeaturedNews />
      <ChipStatus currentPhase={3} />
    </>
  );
}
