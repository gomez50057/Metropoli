import CardsGrid from "@/features/actualizacion-pozmvm/components/CardsGrid/CardsGrid";
import TopicIcon from "./TopicIcon";
import styles from "@/features/actualizacion-pozmvm/components/CardsGrid/CardsGrid.module.css";

export default function GuidingPrinciples() {
  return (
    <CardsGrid
      title={
        <>
          <span className={styles.dorado}>Principios rectores</span>
          {" de la actualización del "}
          <span className={styles.vino}>POZMVM</span>
        </>
      }
      items={[
        { icon: <TopicIcon name="equality" />, text: "Igualdad de derechos y oportunidades para todas las personas en todo el territorio." },
        { icon: <TopicIcon name="communities" />, text: "Las personas, los pueblos y las comunidades se deben situar al centro del desarrollo sostenible e inclusivo del territorio." },
        { icon: <TopicIcon name="city" />, text: "Los hábitats humanos deben ser inclusivos, seguros, resilientes y sostenibles." },
        { icon: <TopicIcon name="cooperation" />, text: "Reforzar el tejido social y el desarrollo comunitario y la participación social." },
        { icon: <TopicIcon name="environment" />, text: "La protección y preservación del medio ambiente es fundamental para lograr el bienestar de todas las personas." },
        { icon: <TopicIcon name="planning" />, text: "Planificación metropolitana con visión de largo plazo." },
        { icon: <TopicIcon name="agriculture" />, text: "Integrar la planificación territorial agraria en el ordenamiento urbano metropolitano." },
        { icon: <TopicIcon name="governance" />, text: "Fortalecer la gobernanza urbana, metropolitana y territorial." },
      ]}
    />
  );
}
