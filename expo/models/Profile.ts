/** An emergency contact linked to the patient's profile. */
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: "primary" | "secondary" | "tertiary";
}

/** Supported languages for the emergency card display. */
export interface LanguagePreference {
  code: string;
  nativeLabel: string;
}

/** Complete medical profile stored on-device. */
export interface MedicalProfile {
  id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  criticalMedications: string[];
  emergencyContacts: EmergencyContact[];
  languagePreference: LanguagePreference;
  recoveryCode: string;
  lastSynced: string | null;
  cloudBackupEnabled: boolean;
  biometricLockEnabled: boolean;
  emergencyId: string | null;
  
}
