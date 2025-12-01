import CardsGrid from "@/components/ActuPozmvm/CardsGrid/CardsGrid";

export default function TransverseAxles() {
  return (
    <CardsGrid
      title="Ejes transversales en la actualización del POZMVM"
      items={[
        { icon: "DH", text: "Derechos Humanos." },
        { icon: "PC", text: "Participación Social y Ciudadana." },
        { icon: "GÉN", text: "Perspectiva de Género e Inclusión." },
        { icon: "CU", text: "Enfoque de Cuenca y Manejo de Acuíferos." },
        { icon: "CC", text: "Gestión Integral de Riesgo y Adaptación al Cambio Climático." },
      ]}
    />
  );
}
