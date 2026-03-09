"use client";

import React from "react";
import { errorTextSmClass, getInputClass, labelClass } from "../styles";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && <label className={labelClass}>{label}</label>}
      <input className={`${getInputClass(!!error)} ${className}`} {...props} />
      {error && <p className={errorTextSmClass}>{error}</p>}
    </div>
  );
};
