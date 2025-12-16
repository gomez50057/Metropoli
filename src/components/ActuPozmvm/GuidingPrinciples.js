import CardsGrid from "@/components/ActuPozmvm/CardsGrid/CardsGrid";
import styles from "@/components/ActuPozmvm/CardsGrid/CardsGrid.module.css";

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
        { icon: "=", text: "Igualdad de derechos y oportunidades para todas las personas en todo el territorio." },
        { icon: "👥", text: "Las personas, los pueblos y las comunidades se deben situar al centro del desarrollo sostenible e inclusivo del territorio." },
        { icon: "🏙️", text: "Los hábitats humanos deben ser inclusivos, seguros, resilientes y sostenibles." },
        { icon: "🤝", text: "Reforzar el tejido social y el desarrollo comunitario y la participación social." },
        { icon: "🌿", text: "La protección y preservación del medio ambiente es fundamental para lograr el bienestar de todas las personas." },
        { icon: "🔭", text: "Planificación metropolitana con visión de largo plazo." },
        { icon: "🌾", text: "Integrar la planificación territorial agraria en el ordenamiento urbano metropolitano." },
        { icon: "🏛️", text: "Fortalecer la gobernanza urbana, metropolitana y territorial." },
      ]}
    />
  );
}
