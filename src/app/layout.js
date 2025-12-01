import Footer from '../components/shared/Footer';
import GoogleAnalytics from '../components/shared/GoogleAnalytics';
import '../styles/globals.css';
import 'gridstack/dist/gridstack.min.css';

export const metadata = {
  title: "Metrópoli Hidalgo | Gobierno del Estado de Hidalgo",
  description: "Las zonas metropolitanas son áreas donde varios municipios convergen conformando un continuo urbano, compartiendo actividades económicas, sociales y de infraestructura. Las Zonas Metropolitanas formalizan esta integración para mejorar la coordinación en temas clave como el desarrollo urbano, la movilidad y la gestión de servicios públicos. Esto permite la colaboración entre municipios para asegurar un crecimiento ordenado, sostenible y que mejore la calidad de vida de sus habitantes.",
  icons: {
    icon: "/favicon.ico",
  },
  authors: [
    {
      name: "Unidad de Planeación y Prospectiva - Coordinación General de Planeación y Proyectos - Gabriel Gómez Gómez",
      // url: "https://planestataldedesarrollo.hidalgo.gob.mx", // personalizar
    },
  ],
  openGraph: {
    title: "Metrópoli Hidalgo",
    description:
      "Explora la estrategia metropolitana para el desarrollo sostenible del Estado de Hidalgo.",
    url: "https://metropoli.hidalgo.gob.mx",
    siteName: "Metrópoli Hidalgo",
    images: [
      {
        url: "/og-image-metropoli.png",
        width: 1200,
        height: 630,
        alt: "Metrópoli Hidalgo - Planeación Metropolitana",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  metadataBase: new URL("https://metropoli.hidalgo.gob.mx"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
