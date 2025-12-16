import CardsGrid from "@/components/ActuPozmvm/CardsGrid/CardsGrid";
import styles from "@/components/ActuPozmvm/CardsGrid/CardsGrid.module.css";

export default function TransverseAxles() {
  return (
    <CardsGrid
      title={
        <>
          <span className={styles.dorado}>Ejes transversales</span>
          {" en la actualización del  "}
          <span className={styles.vino}>POZMVM</span>
        </>
      }
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
