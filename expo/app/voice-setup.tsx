import { useRouter } from "expo-router";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { Mic, MicOff, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

type DetectedField = {
  key: string;
  label: string;
  value: string;
};

const SIMULATED_FIELDS: DetectedField[] = [
  { key: "fullName", label: "Name", value: "Priya Sharma" },
  { key: "bloodType", label: "Blood Type", value: "O+" },
  { key: "allergies", label: "Allergies", value: "Penicillin, Latex, Peanuts" },
  {
    key: "conditions",
    label: "Conditions",
    value: "Type 2 Diabetes, Hypertension",
  },
  { key: "medications", label: "Medications", value: "Metformin, Lisinopril" },
  { key: "dob", label: "Date of Birth", value: "15 April 1992" },
];

const BAR_COUNT = 5;

export default function VoiceSetupScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [statusText, setStatusText] = useState("Tap the microphone to begin");
  const fieldIndexRef = useRef(0);

  // Animated values for waveform bars
  const barAnims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.3)),
  ).current;

  // Pulse animation for the mic ring
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isListening) {
      // Start pulse
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();

      // Animate waveform bars
      const animateBars = () => {
        const animations = barAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 0.4 + Math.random() * 0.6,
            duration: 200 + Math.random() * 300,
            useNativeDriver: true,
          }),
        );
        Animated.parallel(animations).start();
      };

      const barInterval = setInterval(animateBars, 300);

      // Simulate field detection
      const fieldTimer = setInterval(() => {
        const idx = fieldIndexRef.current;
        if (idx < SIMULATED_FIELDS.length) {
          setDetectedFields((prev) => [...prev, SIMULATED_FIELDS[idx]]);
          fieldIndexRef.current = idx + 1;
          setStatusText("Listening…");
        } else {
          setStatusText("All fields detected");
          clearInterval(fieldTimer);
          // Auto-advance after short delay
          setTimeout(() => {
            setIsListening(false);
            router.push("/review");
          }, 1500);
        }
      }, 1500);

      return () => {
        pulse.stop();
        clearInterval(barInterval);
        clearInterval(fieldTimer);
      };
    }
  }, [isListening]);

  const handleMicPress = useCallback(() => {
    if (!isListening) {
      fieldIndexRef.current = 0;
      setDetectedFields([]);
      setStatusText("Listening…");
      setIsListening(true);
    } else {
      setIsListening(false);
      setStatusText("Stopped");
    }
  }, [isListening]);

  const handleManual = useCallback(() => {
    setIsListening(false);
    router.push("/review");
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <X size={24} color={Colors.nearBlack} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.title}>Voice Setup</Text>
        <Text style={styles.subtitle}>
          Speak your medical details and we'll extract them automatically
        </Text>

        {/* Waveform + Mic area */}
        <View style={styles.micArea}>
          {/* Waveform bars above mic when listening */}
          {isListening && (
            <View style={styles.waveformContainer}>
              {barAnims.map((anim, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.waveformBar,
                    {
                      transform: [{ scaleY: anim }],
                      opacity: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Mic button */}
          <TouchableOpacity
            onPress={handleMicPress}
            activeOpacity={0.8}
            style={styles.micButtonOuter}
          >
            <Animated.View
              style={[
                styles.micRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: isListening ? 0.15 : 0,
                },
              ]}
            />
            <View
              style={[styles.micButton, isListening && styles.micButtonActive]}
            >
              {isListening ? (
                <Mic size={40} color={Colors.white} />
              ) : (
                <MicOff size={40} color={Colors.brandGreen} />
              )}
            </View>
          </TouchableOpacity>

          {/* Status text */}
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Detected fields chip row */}
        {detectedFields.length > 0 && (
          <View style={styles.chipsContainer}>
            <Text style={styles.chipsTitle}>Detected so far</Text>
            <View style={styles.chipsRow}>
              {detectedFields.map((field) => (
                <View key={field.key} style={styles.chip}>
                  <Text style={styles.chipLabel}>{field.label}</Text>
                  <Text style={styles.chipValue} numberOfLines={1}>
                    {field.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Manual entry fallback */}
        <TouchableOpacity onPress={handleManual} style={styles.manualLink}>
          <Text style={styles.manualText}>Manual entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 32,
    color: Colors.nearBlack,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 15,
    color: Colors.mediumGray,
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 22,
  },
  micArea: {
    alignItems: "center",
    marginBottom: 48,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 60,
    gap: 4,
    marginBottom: 24,
  },
  waveformBar: {
    width: 4,
    height: 40,
    backgroundColor: Colors.brandGreen,
    borderRadius: 2,
  },
  micButtonOuter: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  micRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.brandGreen,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.brandGreen,
  },
  micButtonActive: {
    backgroundColor: Colors.alertRed,
    borderColor: Colors.alertRed,
  },
  statusText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 16,
    color: Colors.nearBlack,
    marginTop: 20,
  },
  chipsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  chipsTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 13,
    color: Colors.mediumGray,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minWidth: 100,
    flexShrink: 1,
  },
  chipLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 10,
    color: Colors.mediumGray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  chipValue: {
    fontFamily: Fonts.sansRegular,
    fontSize: 14,
    color: Colors.nearBlack,
  },
  manualLink: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  manualText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    color: Colors.brandGreen,
    textDecorationLine: "underline",
  },
});
