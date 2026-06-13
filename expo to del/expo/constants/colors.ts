/**
 * Vitl color palette — clinical but warm.
 * Flat surfaces, no gradients. The green ID card is the signature element.
 */
const Colors = {
  /** Dark forest green — hero ID card background */
  forestGreen: "#1A3D2E" as const,
  /** Brand green — accents, CTAs, active tab */
  brandGreen: "#2D6A4F" as const,
  /** Cream — main background */
  cream: "#F5F5DC" as const,
  /** Near-black — primary text */
  nearBlack: "#1A1A2E" as const,
  /** Alert red — allergies, SOS button */
  alertRed: "#FF6B6B" as const,
  /** Emergency card dark background */
  darkBg: "#12121F" as const,
  /** Muted green for secondary text on dark */
  mutedGreen: "#5C8A6F" as const,
  /** White */
  white: "#FFFFFF" as const,
  /** Off-white for cards on cream */
  offWhite: "#FAFAF0" as const,
  /** Light gray for borders */
  lightGray: "#E5E5DC" as const,
  /** Medium gray for secondary text */
  mediumGray: "#8A8A7A" as const,
  /** Dark red background for allergy sections */
  darkRedBg: "#3D1518" as const,
} as const;

export default Colors;
