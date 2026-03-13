"use client";

import Button from "@/components/landing/ui/button";
import {
    setBudget,
    setBudgetError,
    setCurrentStep, setDestination
} from "@/lib/redux/features/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import React, { useEffect } from "react";
import { useBookingValidation } from "../hooks/useBookingValidation";
import { useMinBudget } from "../hooks/useMinBudget";
import { errorTextClass, getInputClass, labelClass } from "../styles";
import { DepartureCityCombobox } from "./DepartureCityCombobox";
import { DurationDropdown } from "./DurationDropdown";
import { GuestCounter } from "./GuestCounter";
import { TravelDatePicker } from "./TravelDatePicker";
import { TripTypeSelector } from "./TripTypeSelector";

export const Step1Form: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    destination,
    budget,
    tripType,
    guests,
    departureCity,
    travelDate,
    duration,
  } = useAppSelector((state) => state.booking.step1);
  const { step1Errors, budgetError } = useAppSelector(
    (state) => state.booking.validation,
  );
  const { validateStep1 } = useBookingValidation();
  const { days, minBudget } = useMinBudget();

  // Budget validation effect
  useEffect(() => {
    const budgetValue = parseFloat(budget);
    if (budget && !isNaN(budgetValue) && days > 0) {
      if (budgetValue < minBudget) {
        dispatch(
          setBudgetError(
            `Minimum budget for ${guests} person(s) and ${days} day(s) (${tripType}) is ₹${minBudget.toLocaleString("en-IN")}`,
          ),
        );
      } else {
        dispatch(setBudgetError(""));
      }
    } else {
      dispatch(setBudgetError(""));
    }
  }, [budget, guests, days, tripType, minBudget, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateStep1({
      tripType,
      departureCity,
      destination,
      travelDate,
      duration,
      guests,
      budget: parseFloat(budget) || 0,
    });
    
    if (isValid) {
      dispatch(setCurrentStep(2));
    }
  };

  const isFormValid = React.useMemo(() => {
    const budgetValue = parseFloat(budget);
    const hasErrors = Object.keys(step1Errors).length > 0 || !!budgetError;
    const hasEmptyFields =
      !destination ||
      !tripType ||
      !departureCity ||
      !travelDate ||
      !duration ||
      !budget;
    const validGuests = guests > 0 && guests <= 30;
    const validBudget = !isNaN(budgetValue) && budgetValue >= minBudget;

    return !hasErrors && !hasEmptyFields && validGuests && validBudget;
  }, [
    step1Errors,
    budgetError,
    destination,
    tripType,
    departureCity,
    travelDate,
    duration,
    budget,
    guests,
    minBudget,
  ]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Trip Type */}
      <TripTypeSelector />

      {/* Departure & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepartureCityCombobox />
        <div className="space-y-2">
          <label className={labelClass}>Destination*</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => dispatch(setDestination(e.target.value))}
            className={getInputClass(!!step1Errors.destination)}
            placeholder="Enter destination"
            maxLength={15}
          />
          {step1Errors.destination && (
            <p className={errorTextClass}>{step1Errors.destination}</p>
          )}
        </div>
      </div>

      {/* Dates, Duration, Person */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TravelDatePicker />
        <DurationDropdown />
        <GuestCounter />
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <label className={labelClass}>Budget Range *</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => dispatch(setBudget(e.target.value))}
          placeholder="Per Person (₹)"
          className={getInputClass(!!(step1Errors.budget || budgetError))}
        />
        {(step1Errors.budget || budgetError) && (
          <p className={errorTextClass}>{step1Errors.budget || budgetError}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isFormValid}
        className={`w-full font-bold py-4 rounded-lg transition-all text-lg ${
          isFormValid
            ? "bg-primary text-black hover:shadow-lg"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </Button>
    </form>
  );
};
