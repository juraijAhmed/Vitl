import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useCallback, useEffect } from "react";
import { initDB, saveProfile, loadProfile } from "../database/db";  // ADD THIS
import { syncEmergencyProfile } from "../lib/emergencySync";
import type {
  MedicalProfile,
  EmergencyContact,
  LanguagePreference,
} from "../models/Profile";

initDB()


const defaultProfile: MedicalProfile = {
  id: "VTL-001",
  fullName: "Priya Sharma",
  dateOfBirth: "1992-04-15",
  age: 34,
  bloodType: "O+",
  allergies: ["Penicillin", "Latex", "Peanuts"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  criticalMedications: ["Metformin 500mg", "Lisinopril 10mg"],
  emergencyId: null,
  emergencyContacts: [
    {
      id: "ec1",
      name: "Rajesh Sharma",
      relationship: "Spouse",
      phone: "+91 98765 43210",
      priority: "primary",
    },
    {
      id: "ec2",
      name: "Anita Sharma",
      relationship: "Mother",
      phone: "+91 98765 43211",
      priority: "secondary",
    },
  ],
  languagePreference: {
    code: "hi",
    nativeLabel: "हिन्दी",
  },
  recoveryCode: "VITL-4F2K-9XM1",
  lastSynced: new Date().toISOString(),
  cloudBackupEnabled: true,
  biometricLockEnabled: false,
};

export interface ProfileContextValue {
  profile: MedicalProfile;
  updateField: <K extends keyof MedicalProfile>(
    key: K,
    value: MedicalProfile[K],
  ) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  toggleCloudBackup: () => void;
  toggleBiometricLock: () => void;
}

export const [ProfileProvider, useProfile] = createContextHook(
  (): ProfileContextValue => {

    const [profile, setProfile] = useState<MedicalProfile>(
      () => loadProfile() ?? defaultProfile  // CHANGE THIS — SQLite first, default as fallback
    );

    // ADD THIS — persist every change to SQLite
   useEffect(() => {
  saveProfile(profile);

  async function sync() {
    try {
      if (!profile.emergencyId) {
        const emergencyId = await syncEmergencyProfile(profile);

        setProfile((prev) => ({
          ...prev,
          emergencyId,
        }));

        return;
      }

      await syncEmergencyProfile(profile);
    } catch (err) {
      console.log("SUPABASE SYNC ERROR:", err);
    }
  }

  sync();
}, [profile]);
console.log("PROFILE EMERGENCY ID:", profile.emergencyId);

    // Everything below is completely unchanged
    const updateField = useCallback(
      <K extends keyof MedicalProfile>(key: K, value: MedicalProfile[K]) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
      }, []
    );

    const addEmergencyContact = useCallback((contact: EmergencyContact) => {
      setProfile((prev) => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, contact],
      }));
    }, []);

    const removeEmergencyContact = useCallback((id: string) => {
      setProfile((prev) => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
      }));
    }, []);

    const toggleCloudBackup = useCallback(() => {
      setProfile((prev) => ({
        ...prev,
        cloudBackupEnabled: !prev.cloudBackupEnabled,
      }));
    }, []);

    const toggleBiometricLock = useCallback(() => {
      setProfile((prev) => ({
        ...prev,
        biometricLockEnabled: !prev.biometricLockEnabled,
      }));
    }, []);

    return {
      profile,
      updateField,
      addEmergencyContact,
      removeEmergencyContact,
      toggleCloudBackup,
      toggleBiometricLock,
    };
  }
);