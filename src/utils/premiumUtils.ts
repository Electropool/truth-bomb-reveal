
// Premium code management utilities
interface PremiumStatus {
  active: boolean;
  expiresAt: number | null;
}

interface RedeemResult {
  success: boolean;
  message?: string;
}

// Store of valid premium codes (in a real implementation, these would come from a backend)
const VALID_PREMIUM_CODES = [
  'ENDER123', 'HOST1234', 'PREMIUM5', 'BONUS123', 'VIP12345'
];

// Local storage keys
const PREMIUM_STATUS_KEY = 'premium_status';
const USED_CODES_KEY = 'used_premium_codes';

// Get the current premium status
export const getPremiumStatus = (): PremiumStatus => {
  const storedStatusJson = localStorage.getItem(PREMIUM_STATUS_KEY);
  if (!storedStatusJson) {
    return { active: false, expiresAt: null };
  }
  
  const storedStatus = JSON.parse(storedStatusJson) as PremiumStatus;
  
  // Check if premium has expired
  if (storedStatus.expiresAt && storedStatus.expiresAt < Date.now()) {
    // Premium has expired, reset status
    localStorage.removeItem(PREMIUM_STATUS_KEY);
    return { active: false, expiresAt: null };
  }
  
  return storedStatus;
};

// Format the remaining premium time as a user-friendly string
export const getRemainingPremiumTime = (): string => {
  const { active, expiresAt } = getPremiumStatus();
  
  if (!active || !expiresAt) {
    return 'No active premium';
  }
  
  const remainingMs = expiresAt - Date.now();
  
  if (remainingMs <= 0) {
    return 'Expired';
  }
  
  // Convert to hours and minutes
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 1) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h ${minutes}m`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
};

// Check if premium is about to expire soon (within 6 hours)
export const isPremiumExpiringSoon = (): boolean => {
  const { active, expiresAt } = getPremiumStatus();
  
  if (!active || !expiresAt) {
    return false;
  }
  
  const sixHoursInMs = 6 * 60 * 60 * 1000;
  return expiresAt - Date.now() <= sixHoursInMs;
};

// Get list of used premium codes
const getUsedPremiumCodes = (): string[] => {
  const storedCodesJson = localStorage.getItem(USED_CODES_KEY);
  return storedCodesJson ? JSON.parse(storedCodesJson) : [];
};

// Add a code to the used codes list
const markCodeAsUsed = (code: string): void => {
  const usedCodes = getUsedPremiumCodes();
  usedCodes.push(code);
  localStorage.setItem(USED_CODES_KEY, JSON.stringify(usedCodes));
};

// Redeem a premium code
export const redeemPremiumCode = (code: string): RedeemResult => {
  // Check if code is valid
  if (!VALID_PREMIUM_CODES.includes(code)) {
    return { success: false, message: 'Invalid premium code' };
  }
  
  // Check if code has been used before
  const usedCodes = getUsedPremiumCodes();
  if (usedCodes.includes(code)) {
    return { success: false, message: 'This code has already been used' };
  }
  
  // Set premium status (3 days from now)
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + threeDaysInMs;
  
  // Save premium status
  localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify({
    active: true,
    expiresAt
  }));
  
  // Mark code as used
  markCodeAsUsed(code);
  
  return { success: true };
};

// Clear premium status (for testing)
export const clearPremiumStatus = (): void => {
  localStorage.removeItem(PREMIUM_STATUS_KEY);
};
