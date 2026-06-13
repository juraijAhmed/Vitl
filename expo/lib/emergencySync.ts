import { supabase } from "./supabase";
import type { MedicalProfile } from "../models/Profile";

export async function syncEmergencyProfile(
  profile: MedicalProfile
): Promise<string> {
  const emergencyId =
  profile.emergencyId ??
  `vitl_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  const { error } = await supabase
    .from("emergency_profiles")
    .upsert(
      {
        emergency_id: emergencyId,
        full_name: profile.fullName,
        blood_group: profile.bloodType,
        allergies: profile.allergies.join(", "),
        conditions: profile.conditions.join(", "),
        medications: profile.criticalMedications.join(", "),
        emergency_contact_name:
          profile.emergencyContacts[0]?.name ?? "",
        emergency_contact_phone:
          profile.emergencyContacts[0]?.phone ?? "",
      },
      {
        onConflict: "emergency_id",
      }
    );

  if (error) {
    throw error;
  }

  return emergencyId;
}