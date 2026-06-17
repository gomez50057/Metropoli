"use client";

export default function AgreementSearch({ value, onChange, className }) {
  return (
    <input
      className={className}
      name="search"
      placeholder="Buscar"
      value={value}
      onChange={onChange}
    />
  );
}
