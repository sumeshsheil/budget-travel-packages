// Barrel export for booking module
// Re-export main component for backward compatibility

export { BookYourTrip, BookYourTrip as default } from "./BookYourTripWrapper";
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
// Type exports
export * from "./types";




