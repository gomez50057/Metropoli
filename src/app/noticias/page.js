import React from 'react';
import Navbar from '@/components/shared/Navbar';
import BlogMain  from '@/features/blog/components/BlogMain';

export const metadata = {
  title: 'Noticias metropolitanas | Metrópoli Hidalgo',
  description: 'Consulta las noticias, actividades e iniciativas de planeación y desarrollo de las zonas metropolitanas de Hidalgo.',
  alternates: {
    canonical: '/noticias',
  },
  openGraph: {
    title: 'Noticias metropolitanas | Metrópoli Hidalgo',
    description: 'Noticias, actividades e iniciativas de planeación metropolitana en Hidalgo.',
    url: '/noticias',
    type: 'website',
  },
};



const News = () => {
  return (
    <div>
      <Navbar />
      <BlogMain   />
    </div>
  );
};

export default News;
