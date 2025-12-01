"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import './Team.css';

gsap.registerPlugin(ScrollTrigger);

const Team = ({ teamName, teamSubName, teamMembers, isTecnicoTeam = false }) => {
  const teamRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cards = teamRef.current.querySelectorAll('.team-card');

      // Animación de entrada
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
            markers: false,
          },
        }
      );

      // Efecto de hover para zoom y rotación
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, rotateY: 15, duration: 0.5, ease: 'power1.inOut' });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, rotateY: 0, duration: 0.5, ease: 'power1.inOut' });
        });
      });

      // Cambio de color del fondo al desplazar la página
      ScrollTrigger.create({
        trigger: teamRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => gsap.to(cards, { backgroundColor: '#f0f0f0', duration: 0.5 }),
        onLeaveBack: () => gsap.to(cards, { backgroundColor: '#ffffff', duration: 0.5 }),
      });
    }
  }, []);

  return (
    <div className="team-container" ref={teamRef}>
      <h2 className="team-title">{teamName}</h2>
      <h3 className="team-Subtitle">{teamSubName}</h3>
      {teamMembers.map((member, index) => (
        <div key={index} className="team-card">
          <div className="team-card-image">
            <img src={member.image} alt={member.name} />
          </div>
          <div className="team-card-info">
            <h3>{member.name}</h3>
            <p>{member.position}</p>
            {isTecnicoTeam ? <p>{member.gobierno}</p> : <p>{member.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Team;
