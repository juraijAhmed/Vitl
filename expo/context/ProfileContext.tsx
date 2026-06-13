import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useCallback, useEffect } from "react";
import { initDB, saveProfile, loadProfile } from "../database/db";
import type {
  MedicalProfile,
  EmergencyContact,
  LanguagePreference,
} from "../models/Profile";
import {
  postEmergencyNotification,
  setupNotificationChannel,
  requestNotificationPermissions,
} from "../utils/emergencyNotification";
import { registerBackgroundTask } from "../utils/backgroundTask";

initDB();

const defaultProfile: MedicalProfile = {
  id: "VTL-001",
  fullName: "John Doe",
  dateOfBirth: "15-04-2005",
  age: 21,
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  criticalMedications: ["Metformin 500mg", "Lisinopril 10mg"],
  emergencyContacts: [
    {
      id: "ec1",
      name: "Anita Sharma",
      relationship: "Mother",
      phone: "+91 98765 43211",
      priority: "primary",
    },
    {
      id: "ec2",
      name: "Rajesh Sharma",
      relationship: "Brother",
      phone: "+91 9390379183",
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
      () => loadProfile() ?? defaultProfile,
    );

    // Init notifications once on mount
    useEffect(() => {
      async function init() {
        await setupNotificationChannel();
        const granted = await requestNotificationPermissions();
        if (granted) {
          await registerBackgroundTask();
          await postEmergencyNotification(profile);
        }
      }
      init();
    }, []);

    // Persist to SQLite and update notification on every profile change
    useEffect(() => {
      async function syncProfile() {
        await saveProfile(profile);
        await postEmergencyNotification(profile);
      }
      syncProfile();
    }, [profile]);

    const updateField = useCallback(
      <K extends keyof MedicalProfile>(key: K, value: MedicalProfile[K]) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
      },
      [],
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
  },
);
