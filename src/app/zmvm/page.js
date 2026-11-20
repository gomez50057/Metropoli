import Navbar from "@/components/shared/Navbar";
import ZoneOverview from "@/features/metropolitan-zones/components/ZoneOverview";
import Slider from "@/features/home/components/Slider";

export const metadata = {
  title: "Zona Metropolitana del Valle de México | Metrópoli Hidalgo",
  description: "Conoce la Zona Metropolitana del Valle de México, su territorio y sus comisiones metropolitanas.",
};

export default function ValleDeMexicoPage() {
  return (
    <>
      <Navbar />
      <ZoneOverview zone="ZMVM"><Slider /></ZoneOverview>
    </>
  );
}
