import CardsGrid from "@/features/actualizacion-pozmvm/components/CardsGrid/CardsGrid";
import TopicIcon from "./TopicIcon";
import styles from "@/features/actualizacion-pozmvm/components/CardsGrid/CardsGrid.module.css";

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
        { icon: <TopicIcon name="rights" />, text: "Derechos Humanos." },
        { icon: <TopicIcon name="participation" />, text: "Participación Social y Ciudadana." },
        { icon: <TopicIcon name="inclusion" />, text: "Perspectiva de Género e Inclusión." },
        { icon: <TopicIcon name="water" />, text: "Enfoque de Cuenca y Manejo de Acuíferos." },
        { icon: <TopicIcon name="risk" />, text: "Gestión Integral de Riesgo y Adaptación al Cambio Climático." },
      ]}
    />
  );
}
