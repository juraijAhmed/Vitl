/**
 * Emergency Card — what a paramedic sees after scanning the QR.
 * Dark background, bilingual allergy warnings, tap-to-call contacts.
 */
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  X,
  Globe,
  ChevronDown,
  Phone,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import Colors from ".././constants/colors";
import { Fonts } from ".././constants/fonts";
import { useProfile } from ".././context/ProfileContext";

const LANGUAGES = [
  { code: "en", nativeLabel: "English" },
  { code: "hi", nativeLabel: "हिन्दी" },
  { code: "es", nativeLabel: "Español" },
  { code: "zh", nativeLabel: "中文" },
];

export default function EmergencyCardScreen() {
  const { profile } = useProfile();
  const router = useRouter();
  const [lang, setLang] = useState(profile.languagePreference);
  const [showLangPicker, setShowLangPicker] = useState(false);

  // ADD THIS

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <Text style={styles.logo}>Vitl</Text>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setShowLangPicker(!showLangPicker)}
          >
            <Globe size={14} color={Colors.mutedGreen} />
            <Text style={styles.langText}>{lang.nativeLabel}</Text>
            <ChevronDown size={12} color={Colors.mutedGreen} />
          </TouchableOpacity>
        </View>

        {/* Language picker dropdown */}
        {showLangPicker && (
          <View style={styles.langDropdown}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[
                  styles.langOption,
                  l.code === lang.code && styles.langOptionActive,
                ]}
                onPress={() => {
                  setLang(l);
                  setShowLangPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    l.code === lang.code && styles.langOptionTextActive,
                  ]}
                >
                  {l.nativeLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Emergency Medical ID Badge ── */}
        <View style={styles.emergencyBadge}>
          <ShieldAlert size={14} color={Colors.alertRed} />
          <Text style={styles.emergencyBadgeText}>EMERGENCY MEDICAL ID</Text>
        </View>

        {/* ── Patient Name ── */}
        <Text style={styles.patientName}>{profile.fullName}</Text>

        {/* ── Quick Info Row ── */}
        <View style={styles.quickInfo}>
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>Age</Text>
            <Text style={styles.quickInfoValue}>{profile.age}</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>Blood Type</Text>
            <Text style={styles.quickInfoValue}>{profile.bloodType}</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Text style={styles.quickInfoLabel}>DOB</Text>
            <Text style={styles.quickInfoValue}>{profile.dateOfBirth}</Text>
          </View>
        </View>

        {/* ── Allergies Section ── */}
        <View style={styles.allergySection}>
          <View style={styles.allergySectionHeader}>
            <View style={styles.allergyIconRow}>
              <View style={styles.allergyIcon}>
                <ShieldAlert size={16} color={Colors.alertRed} />
              </View>
              <View>
                <Text style={styles.allergyHindi}>एलर्जी — न दें</Text>
                <Text style={styles.allergyEnglish}>
                  (allergies — do not administer)
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.allergyPillRow}>
            {profile.allergies.map((allergy) => (
              <View key={allergy} style={styles.allergyPill}>
                <Text style={styles.allergyPillText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Conditions ── */}
        <Text style={styles.sectionTitle}>Conditions</Text>
        <View style={styles.conditionsList}>
          {profile.conditions.map((condition) => (
            <View key={condition} style={styles.conditionRow}>
              <View style={styles.conditionDot} />
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>

        {/* ── Emergency Contacts ── */}
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {profile.emergencyContacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactLeft}>
              <View style={styles.contactAvatar}>
                <Text style={styles.avatarText}>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>
                  {contact.relationship}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.tapToCall}>
              <Phone size={16} color={Colors.brandGreen} />
              <Text style={styles.tapToCallText}>Call</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>
            vitl.app · Information provided by patient
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  manageContactsButton: {
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: Colors.forestGreen,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  manageContactsText: {
    fontFamily: Fonts.sansBold,
    fontSize: 14,
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    color: Colors.white,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.mutedGreen,
  },
  langDropdown: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 6,
    marginTop: -12,
    marginBottom: 16,
  },
  langOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  langOptionActive: {
    backgroundColor: "rgba(45,106,79,0.2)",
  },
  langOptionText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: Colors.mutedGreen,
  },
  langOptionTextActive: {
    color: Colors.brandGreen,
  },
  // Emergency Badge
  emergencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,107,107,0.12)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  emergencyBadgeText: {
    fontFamily: Fonts.sansBold,
    fontSize: 10,
    color: Colors.alertRed,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  // Patient name
  patientName: {
    fontFamily: Fonts.serif,
    fontSize: 30,
    color: Colors.white,
    marginBottom: 16,
  },
  // Quick Info
  quickInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  quickInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  quickInfoLabel: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: Colors.mutedGreen,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  quickInfoValue: {
    fontFamily: Fonts.sansBold,
    fontSize: 18,
    color: Colors.white,
  },
  quickInfoDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  // Allergy Section
  allergySection: {
    backgroundColor: Colors.darkRedBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  allergySectionHeader: {
    marginBottom: 12,
  },
  allergyIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  allergyIcon: {
    marginTop: 2,
  },
  allergyHindi: {
    fontFamily: Fonts.sansBold,
    fontSize: 16,
    color: Colors.alertRed,
  },
  allergyEnglish: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: "rgba(255,107,107,0.6)",
    marginTop: 2,
  },
  allergyPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  allergyPill: {
    backgroundColor: "rgba(255,107,107,0.15)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  allergyPillText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: Colors.alertRed,
  },
  // Sections
  sectionTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 13,
    color: Colors.mutedGreen,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  conditionsList: {
    marginBottom: 20,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brandGreen,
  },
  conditionText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 15,
    color: Colors.white,
  },
  // Contacts
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.forestGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts.sansBold,
    fontSize: 14,
    color: Colors.white,
  },
  contactName: {
    fontFamily: Fonts.sansBold,
    fontSize: 15,
    color: Colors.white,
  },
  contactRelation: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: Colors.mutedGreen,
    marginTop: 2,
  },
  tapToCall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(45,106,79,0.15)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tapToCallText: {
    fontFamily: Fonts.sansBold,
    fontSize: 13,
    color: Colors.brandGreen,
  },
  // Footer
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 12,
  },
  footerText: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
  },
});
