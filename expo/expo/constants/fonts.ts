/**
 * Font configuration for Vitl.
 * DM Serif Display for the app name and patient name on the ID card.
 * DM Sans for everything else.
 */
import {
  useFonts as useDMSerifDisplay,
  DMSerifDisplay_400Regular,
} from "@expo-google-fonts/dm-serif-display";
import {
  useFonts as useDMSans,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

export function useVitlFonts(): boolean {
  const [serifLoaded] = useDMSerifDisplay({ DMSerifDisplay_400Regular });
  const [sansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  return serifLoaded && sansLoaded;
}

export const Fonts = {
  /** DM Serif Display — for app name, patient name on ID card */
  serif: "DMSerifDisplay_400Regular" as const,
  /** DM Sans Regular — body text */
  sansRegular: "DMSans_400Regular" as const,
  /** DM Sans Medium — labels, buttons */
  sansMedium: "DMSans_500Medium" as const,
  /** DM Sans Bold — headings */
  sansBold: "DMSans_700Bold" as const,
} as const;
