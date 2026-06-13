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
import { ChevronLeft, Check, Globe } from "lucide-react-native";
import Colors from ".././constants/colors";
import { Fonts } from ".././constants/fonts";

export default function ReviewScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Priya Sharma");
  const [bloodType, setBloodType] = useState("O+");
  const [allergies, setAllergies] = useState("Penicillin, Latex, Peanuts");
  const [conditions, setConditions] = useState("Type 2 Diabetes, Hypertension");
  const [medications, setMedications] = useState("Metformin 500mg, Lisinopril 10mg");
  const [dob, setDob] = useState("15 April 1992");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.nearBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Confirm</Text>
        <View style={styles.backButton} />
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
          <Text style={styles.description}>
            Please review and edit the details we detected. Everything is accurate?
            You're good to go.
          </Text>

          {/* Regular fields */}
          <Field label="Full Name" value={fullName} onChange={setFullName} />
          <Field label="Blood Type" value={bloodType} onChange={setBloodType} />
          <Field label="Date of Birth" value={dob} onChange={setDob} />
          <Field label="Medical Conditions" value={conditions} onChange={setConditions} isMultiline />
          <Field
            label="Critical Medications"
            value={medications}
            onChange={setMedications}
            isMultiline
          />

          {/* Allergies — red border */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, styles.fieldLabelRed]}>Allergies</Text>
            <TextInput
              style={[styles.fieldInput, styles.fieldInputRed, styles.fieldInputMultiline]}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="e.g. Penicillin, Latex, Peanuts"
              placeholderTextColor={Colors.mediumGray}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Language preference */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Preferred Language</Text>
            <View style={styles.languageRow}>
              <View style={styles.languagePill}>
                <Globe size={14} color={Colors.brandGreen} />
                <Text style={styles.languageText}>Hindi — हिन्दी</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.9}
            onPress={() => {
              router.back();
              router.navigate("/");
            }}
          >
            <Check size={20} color={Colors.white} />
            <Text style={styles.saveButtonText}>Save and generate QR</Text>
          </TouchableOpacity>

          {/* Privacy note */}
          <Text style={styles.privacyNote}>Your data stays on your device.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  isMultiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isMultiline?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, isMultiline && styles.fieldInputMultiline]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  flex: {
    flex: 1,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 48,
  },
  description: {
    fontFamily: Fonts.sansRegular,
    fontSize: 14,
    color: Colors.mediumGray,
    lineHeight: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
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
  fieldInputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },
  fieldInputRed: {
    borderColor: Colors.alertRed,
    borderWidth: 2,
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
  saveButton: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    fontFamily: Fonts.sansBold,
    fontSize: 16,
    color: Colors.white,
  },
  privacyNote: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: Colors.mediumGray,
    textAlign: "center",
  },
});
