import { useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { AlertTriangle, ChevronRight, Phone, Send } from "lucide-react-native";
import Colors from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { useProfile } from "../../context/ProfileContext";
import { postEmergencyNotification } from "@/utils/emergencyNotification";

export default function VitalsScreen() {
  const { profile } = useProfile();
  const router = useRouter();
  const qrRef = useRef<{ toDataURL: (cb: (data: string) => void) => void } | null>(null);

  useEffect(() => {
    if (!profile.emergencyId) return;
    console.log("emergencyId found:", profile.emergencyId);
    setTimeout(() => {
      console.log("qrRef.current:", qrRef.current);
      qrRef.current?.toDataURL((base64: string) => {
        console.log("base64 length:", base64?.length);
        postEmergencyNotification(profile, base64)
          .then(() => console.log("Notification posted"))
          .catch((e) => console.log("Notification error:", e));
      });
    }, 600);
  }, [profile.emergencyId]);

  const handleSOS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      const message =
        `🚨 SOS ALERT 🚨\n\n` +
        `${profile.fullName} may need immediate assistance.\n\n` +
        `Current Location:\n${mapsLink}`;
      const primaryContact = profile.emergencyContacts.find(
        (contact) => contact.priority === "primary",
      );
      if (!primaryContact) {
        alert("No primary emergency contact found.");
        return;
      }
      const smsUrl = `sms:${primaryContact.phone}?body=${encodeURIComponent(message)}`;
      await Linking.openURL(smsUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to create SOS message.");
    }
  };

  const initials = (name: string): string =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const priorityColor = (p: string): string => {
    switch (p) {
      case "primary": return Colors.alertRed;
      case "secondary": return "#E8A838";
      default: return Colors.mediumGray;
    }
  };

  const priorityLabel = (p: string): string =>
    p.charAt(0).toUpperCase() + p.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ID Card ── */}
        <View style={styles.heroCard}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.logoText}>Vitl</Text>
              <Text style={styles.cardSubtitle}>Medical Identity</Text>
            </View>
            <View style={styles.qrCode}>
              {profile.emergencyId ? (
                <QRCode
                  value={`https://vitl-web.vercel.app/e/${profile.emergencyId}`}
                  size={52}
                  getRef={(ref: any) => { qrRef.current = ref; }}
                />
              ) : null}
            </View>
          </View>

          <Text style={styles.patientName}>{profile.fullName}</Text>

          <View style={styles.scanLabel}>
            <View style={styles.scanDot} />
            <Text style={styles.scanText}>SCAN IN EMERGENCY</Text>
          </View>

          <View style={styles.chipRow}>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipValue}>{profile.bloodType}</Text>
              <Text style={styles.infoChipLabel}>Blood Type</Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipValue}>{profile.age}</Text>
              <Text style={styles.infoChipLabel}>Age</Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoChipValue}>
                {profile.languagePreference.nativeLabel}
              </Text>
              <Text style={styles.infoChipLabel}>Language</Text>
            </View>
          </View>
        </View>

        {/* ── Allergy Band ── */}
        <View style={styles.allergyBand}>
          <View style={styles.allergyHeader}>
            <AlertTriangle size={18} color={Colors.alertRed} />
            <Text style={styles.allergyTitle}>Allergies</Text>
          </View>
          <View style={styles.allergyPillRow}>
            {profile.allergies.map((allergy) => (
              <View key={allergy} style={styles.allergyPill}>
                <Text style={styles.allergyPillText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Conditions Section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions</Text>
          {profile.conditions.length > 0 ? (
            profile.conditions.map((condition) => (
              <View key={condition} style={styles.conditionRow}>
                <View style={styles.conditionDot} />
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No conditions recorded</Text>
          )}
        </View>

        {/* ── Emergency Contacts ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {profile.emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactLeft}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.avatarText}>{initials(contact.name)}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  <View style={styles.contactPriority}>
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: priorityColor(contact.priority) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.priorityText,
                        { color: priorityColor(contact.priority) },
                      ]}
                    >
                      {priorityLabel(contact.priority)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.contactRight}>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => Linking.openURL(`tel:${contact.phone}`)}
                >
                  <Phone size={20} color={Colors.brandGreen} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* ── SOS Button ── */}
        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.85}
          onPress={handleSOS}
        >
          <Send size={20} color={Colors.white} />
          <Text style={styles.sosButtonText}>Alert emergency contacts</Text>
        </TouchableOpacity>
        <Text style={styles.sosSubline}>Sends your GPS location via SMS</Text>

        <TouchableOpacity
          style={styles.viewCardButton}
          onPress={() => router.push("/emergency-card")}
        >
          <Text style={styles.viewCardText}>Preview emergency card</Text>
          <ChevronRight size={16} color={Colors.brandGreen} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  heroCard: {
    backgroundColor: Colors.forestGreen,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logoText: { fontFamily: Fonts.serif, fontSize: 24, color: Colors.white },
  cardSubtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  qrCode: {
    width: 64,
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  patientName: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.white,
    marginBottom: 8,
  },
  scanLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  scanDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brandGreen },
  scanText: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    color: Colors.brandGreen,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  chipRow: { flexDirection: "row", gap: 8 },
  infoChip: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flex: 1,
    alignItems: "center",
  },
  infoChipValue: {
    fontFamily: Fonts.sansBold,
    fontSize: 15,
    color: Colors.white,
    marginBottom: 2,
  },
  infoChipLabel: {
    fontFamily: Fonts.sansRegular,
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  allergyBand: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.alertRed,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  allergyHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  allergyTitle: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.alertRed },
  allergyPillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  allergyPill: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.alertRed,
  },
  allergyPillText: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.nearBlack },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 14,
    color: Colors.nearBlack,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  conditionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.brandGreen },
  conditionText: { fontFamily: Fonts.sansRegular, fontSize: 15, color: Colors.nearBlack, flex: 1 },
  noData: { fontFamily: Fonts.sansRegular, fontSize: 14, color: Colors.mediumGray, fontStyle: "italic" },
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  contactLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.forestGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: Fonts.sansBold, fontSize: 15, color: Colors.white },
  contactInfo: { flex: 1 },
  contactName: { fontFamily: Fonts.sansBold, fontSize: 15, color: Colors.nearBlack },
  contactRelation: { fontFamily: Fonts.sansRegular, fontSize: 13, color: Colors.mediumGray, marginTop: 1 },
  contactPriority: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  priorityText: { fontFamily: Fonts.sansMedium, fontSize: 11 },
  contactRight: { alignItems: "flex-end", gap: 6 },
  contactPhone: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.nearBlack },
  callButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(45,106,79,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    backgroundColor: Colors.alertRed,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 6,
    shadowColor: Colors.alertRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sosButtonText: { fontFamily: Fonts.sansBold, fontSize: 16, color: Colors.white },
  sosSubline: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: Colors.mediumGray,
    textAlign: "center",
    marginBottom: 16,
  },
  viewCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
  },
  viewCardText: { fontFamily: Fonts.sansMedium, fontSize: 14, color: Colors.brandGreen },
});