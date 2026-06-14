/**
 * Profile / Settings Screen
 * Recovery code card, settings rows, sign out.
 */
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import {
  Globe,
  Cloud,
  Fingerprint,
  Info,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react-native";
import Colors from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { useProfile } from "../../context/ProfileContext";

export default function ProfileScreen() {
  const { profile } = useProfile();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.memberSince}>Member since June 2026</Text>

        {/* Recovery Code Card */}
        <View style={styles.recoveryCard}>
          <View style={styles.recoveryHeader}>
            <Shield size={16} color={Colors.cream} />
            <Text style={styles.recoveryTitle}>Recovery Code</Text>
          </View>
          <Text style={styles.recoveryCode}>{profile.emergencyId}</Text>
          <Text style={styles.recoveryNote}>
            Use this to restore your profile on a new device.
          </Text>
        </View>

        {/* Settings Rows */}
        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/edit-profile")}
          >
            <View style={styles.settingLeft}>
              <Globe size={18} color={Colors.nearBlack} />
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Edit emergency card </Text>
                <Text style={styles.settingValue}>
                  {profile.languagePreference.nativeLabel}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.mediumGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Info size={18} color={Colors.nearBlack} />
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>About Vitl</Text>
                <Text style={styles.settingValue}>Version 1.0.0</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.mediumGray} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: Colors.nearBlack,
    marginBottom: 4,
  },
  memberSince: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: Colors.mediumGray,
    marginBottom: 24,
  },
  // Recovery Card
  recoveryCard: {
    backgroundColor: Colors.forestGreen,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  recoveryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  recoveryTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 13,
    color: Colors.cream,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recoveryCode: {
    fontFamily: "Courier",
    fontSize: 28,
    color: Colors.white,
    letterSpacing: 4,
    marginBottom: 8,
    fontWeight: "700",
  },
  recoveryNote: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: "rgba(245,245,220,0.6)",
  },
  // Settings
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingTextGroup: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    color: Colors.nearBlack,
  },
  settingValue: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: Colors.mediumGray,
    marginTop: 2,
  },
  // Sign Out
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.alertRed,
  },
  signOutText: {
    fontFamily: Fonts.sansBold,
    fontSize: 15,
    color: Colors.alertRed,
  },
});
