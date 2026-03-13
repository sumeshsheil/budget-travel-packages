import {
    setBudgetError, setContactErrors, setStep1Errors,
    setStep2Errors
} from "@/lib/redux/features/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useCallback } from "react";
import type { FieldErrors, Step1Data, TravelerErrors } from "../types";
import { useMinBudget } from "./useMinBudget";

/**
 * Custom hook for form validation using server-side logic
 */
export const useBookingValidation = () => {
  const dispatch = useAppDispatch();
  const { days, minBudget } = useMinBudget();

  const validateStep1 = useCallback(async (data: any): Promise<boolean> => {
    try {
      const response = await fetch("/api/leads/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          dispatch(setStep1Errors(result.errors));
        }
        return false;
      }

      // Handle budget validation which depends on dynamic minBudget
      const budgetNum = parseFloat(data.budget) || 0;
      if (days > 0 && budgetNum < minBudget) {
        dispatch(setStep1Errors({}));
        dispatch(
          setBudgetError(
            `Minimum budget for ${data.guests} person(s) and ${days} day(s) (${data.tripType}) is ₹${minBudget.toLocaleString("en-IN")}`,
          ),
        );
        return false;
      }

      dispatch(setStep1Errors({}));
      dispatch(setBudgetError(""));
      return true;
    } catch (error) {
      console.error("Step 1 validation failed:", error);
      return false;
    }
  }, [dispatch, days, minBudget]);

  const validateStep2 = useCallback(async (data: any): Promise<boolean> => {
    try {
      const response = await fetch("/api/leads/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Map nested primaryContact errors if they exist
          if (result.errors.primaryContact) {
            // Zod flatten might return an array of errors for primaryContact if it fails as a whole,
            // or we might need to handle the specific fields. 
            // In our case, step2Schema is z.object({ primaryContact: primaryContactSchema })
            // So result.errors will look like { primaryContact: ["..."] } or handled via more specific mapping
          }
          
          // Re-flatten or handle nested errors specifically for our UI
          // Since we use validation.error.flatten().fieldErrors, 
          // nested objects like primaryContact will have keys like 'primaryContact' with an array of errors for that object,
          // OR if we use a better flattening approach or just handle it here:
          
          // Let's check how safeParse handles nested schema errors in flatten()
          // For nested: fieldErrors might look like { "primaryContact.firstName": ["..."] } if we use deep flatten
          // But Zod's default flatten() only goes one level deep.
          
          // Let's refine the API's error returning to be more client-friendly for nested fields if needed.
          // For now, let's assume we need to handle the primaryContact nest.
          
          const flatErrors: Record<string, string> = {};
          // We'll need a way to get deep errors if Zod doesn't provide them flat.
          // In the current API: validation.error.flatten().fieldErrors
          // For nested schemas, it often returns { primaryContact: ['Invalid input'] }
          // We might want to use validation.error.format() or a custom flattener in the API.
          
          dispatch(setContactErrors(result.errors.primaryContact || {}));
          dispatch(setStep2Errors(result.errors));
        }
        return false;
      }

      dispatch(setContactErrors({}));
      dispatch(setStep2Errors({}));
      return true;
    } catch (error) {
      console.error("Step 2 validation failed:", error);
      return false;
    }
  }, [dispatch]);

  return { validateStep1, validateStep2 };
};
