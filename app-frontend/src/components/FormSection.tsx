"use client"
import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
};

export default FormSection;
