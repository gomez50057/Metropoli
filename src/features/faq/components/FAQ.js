// Archivo: src/components/FAQ.js
"use client"; // Para indicar que este componente es cliente en Next.js 13+

import React, { useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { categories, questions } from '@/data/faqData';
import fAQStyles from './FAQ.module.css';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('Formulario');
  const [openQuestion, setOpenQuestion] = useState(null);

  const handleToggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div>
      <div className={fAQStyles["faq-title"]}>
        <h1>Preguntas <span className={fAQStyles["span-dorado"]}>Frecuentes</span></h1>
        <p>¿Cómo Empezar?</p>
      </div>

      <div className={fAQStyles["faq-container"]}>
        <div className={fAQStyles["faq-sidebar"]}>
          <ul className={fAQStyles["faq-category-list"]}>
            {categories.map((category) => (
              <li
                key={category.id}
                className={`${fAQStyles["faq-category-item"]} ${activeCategory === category.id ? fAQStyles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                <span>{category.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={fAQStyles["faq-content"]}>
          {questions[activeCategory].map((q, index) => (
            <div key={index} className={fAQStyles["faq-question"]}>
              <div
                className={fAQStyles["faq-question-header"]}
                onClick={() => handleToggleQuestion(index)}
              >
                <span>{q.question}</span>
                {openQuestion === index ? <ExpandLess /> : <ExpandMore />}
              </div>
              {openQuestion === index && (
                <div className={fAQStyles["faq-answer"]}>
                  <p>{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
