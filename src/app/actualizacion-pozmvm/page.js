import Navbar from '@/components/shared/Navbar';
import Hero from "@/components/ActuPozmvm/Hero";
import SplitSection from "@/components/ActuPozmvm/SplitSection";
import AntecedentesSection from "@/components/ActuPozmvm/AntecedentesSection";
import TransverseAxles from "@/components/ActuPozmvm/TransverseAxles";
import GuidingPrinciples from "@/components/ActuPozmvm/GuidingPrinciples";
import ChipStatus from "@/components/ActuPozmvm/ChipStatus";

export default function PagePOZMVM() {
  return (
    <>
      <Navbar />
      <Hero />
      <SplitSection />
      <AntecedentesSection />
      <TransverseAxles />
      <GuidingPrinciples/>
      <ChipStatus label="Fase 3.  Modelo de Ordenamiento Territorial." />
    </>
  );
}
