// Barrel export for booking module
// Re-export main component for backward compatibility

export { default as BookYourTrip, default } from "./BookYourTripSection";
// Component exports
export * from "./components/BookingFormCard";
export * from "./components/DepartureCityCombobox";
export * from "./components/DurationDropdown";
export * from "./components/FormInput";
export * from "./components/FormSelect";
export * from "./components/FormTextarea";
export * from "./components/GuestCounter";
export * from "./components/Step1Form";
export * from "./components/Step2Form";
export * from "./components/StepIndicator";
export * from "./components/TravelDatePicker";
export * from "./components/TripTypeSelector";
// Hook exports
export * from "./hooks/useBookingValidation";
export * from "./hooks/useMinBudget";
// Schema exports (for external validation if needed)
export * from "./schemas";
// Type exports
export * from "./types";




