import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { initDB, saveProfile, loadProfile } from "../database/db";
import { syncEmergencyProfile } from "../lib/emergencySync";
import type { MedicalProfile, EmergencyContact } from "../models/Profile";
import {
  postEmergencyNotification,
  setupNotificationChannel,
  requestNotificationPermissions,
} from "../utils/emergencyNotification";
import { registerBackgroundTask } from "../utils/backgroundTask";

initDB();

const defaultProfile: MedicalProfile = {
  id: "VTL-001",
  fullName: "",
  dateOfBirth: "",
  age: 0,
  bloodType: "",
  allergies: [],
  conditions: [],
  criticalMedications: [],
  emergencyContacts: [],
  languagePreference: {
    code: "en",
    nativeLabel: "English",
  },
  recoveryCode: "",
  lastSynced: new Date().toISOString(),
  cloudBackupEnabled: true,
  emergencyId: null,
  biometricLockEnabled: false,
};

export interface ProfileContextValue {
  profile: MedicalProfile;
  updateField: <K extends keyof MedicalProfile>(
    key: K,
    value: MedicalProfile[K]
  ) => void;
  updateMany: (fields: Partial<MedicalProfile>) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  toggleCloudBackup: () => void;
  toggleBiometricLock: () => void;
}

export const [ProfileProvider, useProfile] = createContextHook(
  (): ProfileContextValue => {
    const [profile, setProfile] = useState<MedicalProfile>(() => {
      return loadProfile() ?? defaultProfile;
    });

    const emergencyIdRef = useRef<string | null>(null);
    const initializedRef = useRef(false);

    // Init notifications once
    useEffect(() => {
      (async () => {
        await setupNotificationChannel();
        const granted = await requestNotificationPermissions();
        if (granted) {
          await registerBackgroundTask();
        }
      })();
    }, []);

    // Persistence + sync (NO setProfile here)
    useEffect(() => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        return;
      }

      const sync = async () => {
        await saveProfile(profile);
        await postEmergencyNotification(profile);

        // avoid syncing empty onboarding state
        if (!profile.fullName) return;

        try {
          const emergencyId = await syncEmergencyProfile(profile);
          if (emergencyId && emergencyId !== emergencyIdRef.current) {
            emergencyIdRef.current = emergencyId;
            // persist only, do NOT re-set state
            await saveProfile({ ...profile, emergencyId });
          }
        } catch (e) {
          console.log("Sync failed:", e);
        }
      };

      sync();
    }, [profile]);

    const updateField = useCallback(
      <K extends keyof MedicalProfile>(key: K, value: MedicalProfile[K]) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
      },
      []
    );

    // Atomic multi-field update — use this instead of multiple updateField
    // calls to avoid stale-closure overwrites (e.g. in onboarding finish())
    const updateMany = useCallback((fields: Partial<MedicalProfile>) => {
      setProfile((prev) => ({ ...prev, ...fields }));
    }, []);

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
      updateMany,
      addEmergencyContact,
      removeEmergencyContact,
      toggleCloudBackup,
      toggleBiometricLock,
    };
  }
);