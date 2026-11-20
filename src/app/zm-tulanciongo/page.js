import Navbar from "@/components/shared/Navbar";
import ZoneOverview from "@/features/metropolitan-zones/components/ZoneOverview";

export const metadata = {
  title: "Zona Metropolitana de Tulancingo | Metrópoli Hidalgo",
  description: "Conoce la Zona Metropolitana de Tulancingo y los municipios que la integran.",
};

export default function TulancingoPage() {
  return (
    <>
      <Navbar />
      <ZoneOverview zone="ZMTulancingo" />
    </>
  );
}
