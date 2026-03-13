"use client";

import React from "react";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { labelClass } from "../styles";
import type { Traveler } from "../types";

interface ContactDetailsFieldsProps {
  primaryContact: Traveler;
  contactErrors: Record<string, string>;
  onChange: (field: keyof Traveler, value: string | number) => void;
}

export const ContactDetailsFields: React.FC<ContactDetailsFieldsProps> = ({
  primaryContact,
  contactErrors,
  onChange,
}) => {
  const genderOptions = [
    { value: "", label: "Gender", disabled: true },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-4">
      <label className={labelClass}>Primary Contact Details *</label>

      <div className="border border-primary rounded-lg p-4 md:p-6 space-y-4 bg-white shadow-sm">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            type="text"
            value={primaryContact.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="First Name"
            error={contactErrors.firstName}
          />
          <FormInput
            type="text"
            value={primaryContact.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Last Name"
            error={contactErrors.lastName}
          />
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            value={primaryContact.gender}
            onChange={(e) => onChange("gender", e.target.value as any)}
            options={genderOptions}
            error={contactErrors.gender}
          />
          <FormInput
            type="number"
            value={primaryContact.age || ""}
            onChange={(e) =>
              onChange("age", parseInt(e.target.value) || 0)
            }
            placeholder="Age"
            min="1"
            max="120"
            error={contactErrors.age}
          />
        </div>

        {/* Email Row */}
        <FormInput
          type="email"
          value={primaryContact.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Email"
          error={contactErrors.email}
        />
      </div>
    </div>
  );
};
