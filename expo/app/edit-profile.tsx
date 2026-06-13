/**
 * Edit Profile Screen — accessible from Profile tab.
 * Backed up to cloud banner, editable medical fields, and language preference.
 */
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  ChevronLeft,
  Cloud,
  Check,
  Pencil,
  Plus,
  Globe,
} from "lucide-react-native";
import Colors from ".././constants/colors";
import { Fonts } from ".././constants/fonts";
import { useProfile } from ".././context/ProfileContext";

export default function EditProfileScreen() {
  const { profile, updateField } = useProfile();
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.fullName);

  const [allergies, setAllergies] = useState(profile.allergies.join(", "));

  const [medications, setMedications] = useState(
    profile.criticalMedications.join(", "),
  );

  const [conditions, setConditions] = useState(profile.conditions.join(", "));
  const handleSave = () => {
    updateField("fullName", fullName);
    updateField(
      "allergies",
      allergies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
    updateField(
      "criticalMedications",
      medications
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
    updateField(
      "conditions",
      conditions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={Colors.nearBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveLink}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cloud backup banner */}
          <View style={styles.cloudBanner}>
            <Cloud size={16} color={Colors.brandGreen} />
            <Text style={styles.cloudText}>
              Backed up to cloud · Last synced just now
            </Text>
          </View>

          {/* Personal Info */}
          <Text style={styles.sectionLabel}>Personal Info</Text>
          <EditableField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
          />

          {/* Medical Info */}
          <Text style={styles.sectionLabel}>Medical Info</Text>
          <EditableField
            label="Allergies"
            value={allergies}
            onChange={setAllergies}
            isRed
            isMultiline
          />
          <EditableField
            label="Critical Medications"
            value={medications}
            onChange={setMedications}
            isMultiline
          />
          <EditableField
            label="Medical Conditions"
            value={conditions}
            onChange={setConditions}
            isMultiline
          />

          {/* Emergency Contacts */}
          {/* Emergency Contacts */}
          <Text style={styles.sectionLabel}>Emergency Contacts</Text>

          {profile.emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactDetail}>
                  {contact.relationship} · {contact.phone}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.pencilButton}
                onPress={() => router.push("/emergency-contacts")}
              >
                <Pencil size={16} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addContact}
            onPress={() => router.push("/emergency-contacts")}
          >
            <Plus size={16} color={Colors.brandGreen} />
            <Text style={styles.addContactText}>
              Manage contacts · {profile.emergencyContacts.length} of 3 used
            </Text>
          </TouchableOpacity>

          {/* Language Preference */}
          <Text style={styles.sectionLabel}>Language Preference</Text>
          <View style={styles.languageRow}>
            <View style={styles.languagePill}>
              <Globe size={14} color={Colors.brandGreen} />
              <Text style={styles.languageText}>
                {profile.languagePreference.nativeLabel}
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EditableField({
  label,
  value,
  onChange,
  isRed,
  isMultiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isRed?: boolean;
  isMultiline?: boolean;
}) {
  return (
    <View style={editableStyles.fieldContainer}>
      <Text
        style={[
          editableStyles.fieldLabel,
          isRed && editableStyles.fieldLabelRed,
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[
          editableStyles.fieldInput,
          isRed && editableStyles.fieldInputRed,
          isMultiline && editableStyles.fieldInputMultiline,
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor={Colors.mediumGray}
        multiline={isMultiline}
        textAlignVertical={isMultiline ? "top" : "center"}
      />
    </View>
  );
}

const editableStyles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },

  fieldLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 13,
    color: Colors.nearBlack,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  fieldLabelRed: {
    color: Colors.alertRed,
  },
  fieldInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.sansRegular,
    fontSize: 16,
    color: Colors.nearBlack,
    minHeight: 48,
  },
  fieldInputRed: {
    borderColor: Colors.alertRed,
    borderWidth: 2,
  },
  fieldInputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  flex: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 18,
    color: Colors.nearBlack,
    marginBottom: 16,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontFamily: Fonts.sansRegular,
  },

  modalSaveButton: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  modalSaveText: {
    color: Colors.white,
    fontFamily: Fonts.sansBold,
  },

  modalDeleteButton: {
    backgroundColor: Colors.alertRed,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  modalDeleteText: {
    color: Colors.white,
    fontFamily: Fonts.sansBold,
  },

  modalCancelText: {
    textAlign: "center",
    marginTop: 16,
    color: Colors.mediumGray,
    fontFamily: Fonts.sansMedium,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 20,
    color: Colors.nearBlack,
  },
  saveLink: {
    fontFamily: Fonts.sansBold,
    fontSize: 16,
    color: Colors.brandGreen,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
  cloudBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(45,106,79,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
  },
  cloudText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: Colors.brandGreen,
    flex: 1,
  },
  sectionLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 12,
    color: Colors.mediumGray,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 14,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: Fonts.sansBold,
    fontSize: 15,
    color: Colors.nearBlack,
  },
  contactDetail: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: Colors.mediumGray,
    marginTop: 2,
  },
  pencilButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  addContactText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.brandGreen,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  languagePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.brandGreen,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  languageText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.nearBlack,
  },
  changeLink: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.brandGreen,
  },
});
