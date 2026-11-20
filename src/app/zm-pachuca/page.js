import Navbar from "@/components/shared/Navbar";
import ZoneOverview from "@/features/metropolitan-zones/components/ZoneOverview";

export const metadata = {
  title: "Zona Metropolitana de Pachuca | Metrópoli Hidalgo",
  description: "Conoce la Zona Metropolitana de Pachuca y los municipios que la integran.",
};

export default function PachucaPage() {
  return (
    <>
      <Navbar />
      <ZoneOverview zone="ZMP" />
    </>
  );
}
