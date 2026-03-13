export interface ProfileCompletionData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  isPhoneVerified?: boolean;
  image?: string;
  gender?: string;
  birthDate?: string | Date;
  aadhaarNumber?: string;
  documents?: {
    aadharCard?: string[];
  };
}

/**
 * Calculates profile completion percentage based on provided data.
 * Weights:
 * - Name (10%): either name OR both firstName and lastName
 * - Email (10%)
 * - Phone (10%)
 * - Phone Verified (20%)
 * - Image (10%)
 * - Gender (10%)
 * - Birth Date (10%)
 * - Aadhaar Number (10%): valid 12-digit format
 * - Aadhaar Document (10%): at least one document uploaded
 * Total: 100%
 */
export const calculateProfileCompletion = (profile: ProfileCompletionData | null): number => {
  if (!profile) return 0;
  let points = 0;
  
  // Name: 10%
  if ((profile.firstName && profile.lastName) || profile.name) points += 10;
  
  // Email: 10%
  if (profile.email) points += 10;
  
  // Phone: 10%
  if (profile.phone) points += 10;
  
  // Phone Verified: 20%
  if (profile.isPhoneVerified) points += 20;
  
  // Image: 10%
  if (profile.image) points += 10;
  
  // Gender: 10%
  if (profile.gender) points += 10;
  
  // Birth Date: 10%
  if (profile.birthDate) points += 10;
  
  // Aadhaar Number: 10%
  if (profile.aadhaarNumber && /^\d{12}$/.test(profile.aadhaarNumber)) points += 10;
  
  // Aadhaar Document: 10%
  if (profile.documents?.aadharCard?.length) points += 10;
  
  return Math.min(points, 100);
};

/**
 * Checks if the profile is 100% complete.
 */
export const isProfileFullyComplete = (profile: ProfileCompletionData | null): boolean => {
  return calculateProfileCompletion(profile) === 100;
};
