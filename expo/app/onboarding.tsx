import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfile } from "../context/ProfileContext";
import type { EmergencyContact } from "../models/Profile";
import { Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react-native";
import Colors from "../constants/colors";
import { Fonts } from "../constants/fonts";

const ONBOARDING_KEY = "vitl_onboarding_complete";

const STEPS = [
  { title: "Personal Info", subtitle: "Basic details for your medical ID" },
  { title: "Medical Details", subtitle: "Allergies, conditions, medications" },
  { title: "Emergency Contact", subtitle: "Who should responders call first?" },
];

// ─── Field ────────────────────────────────────────────────────────────────
function Field({ label, value, onChangeText, placeholder, keyboardType = "default", hint }: any) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      {hint ? <Text style={f.hint}>{hint}</Text> : null}
      <TextInput
        style={f.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.mediumGray}
        keyboardType={keyboardType}
      />
    </View>
  );
}

// ─── TagInput ─────────────────────────────────────────────────────────────
function TagInput({ label, values, onChange, placeholder }: any) {
  const [text, setText] = useState("");

  const add = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setText("");
  };

  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <View style={f.tagRow}>
        <TextInput
          style={[f.input, { flex: 1, marginBottom: 0 }]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={Colors.mediumGray}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={f.addBtn} onPress={add}>
          <Plus color={Colors.white} size={18} />
        </TouchableOpacity>
      </View>
      <View style={f.chips}>
        {values.map((v: string, i: number) => (
          <TouchableOpacity
            key={i}
            style={f.chip}
            onPress={() => onChange(values.filter((_: any, j: number) => j !== i))}
          >
            <Text style={f.chipText}>{v}</Text>
            <Text style={f.chipX}>×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────
function StepPersonal({ data, onChange }: any) {
  const BLOOD_TYPES = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

  return (
    <View style={s.stepContent}>
      <Field
        label="Full Name"
        value={data.fullName}
        onChangeText={(v: string) => onChange("fullName", v)}
        placeholder="Jane Doe"
      />
      <Field
        label="Date of Birth"
        value={data.dateOfBirth}
        onChangeText={(v: string) => onChange("dateOfBirth", v)}
        placeholder="DD-MM-YYYY"
        hint="Format: DD-MM-YYYY"
      />
      <Text style={f.label}>Blood Type</Text>
      <View style={s.bloodGrid}>
        {BLOOD_TYPES.map((bt) => (
          <TouchableOpacity
            key={bt}
            style={[s.bloodBtn, data.bloodType === bt && s.bloodBtnActive]}
            onPress={() => onChange("bloodType", bt)}
          >
            <Text style={[s.bloodText, data.bloodType === bt && s.bloodTextActive]}>
              {bt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────
function StepMedical({ data, onChange }: any) {
  return (
    <View style={s.stepContent}>
      <TagInput
        label="Allergies"
        values={data.allergies}
        onChange={(v: string[]) => onChange("allergies", v)}
        placeholder="e.g. Penicillin"
      />
      <TagInput
        label="Medical Conditions"
        values={data.conditions}
        onChange={(v: string[]) => onChange("conditions", v)}
        placeholder="e.g. Diabetes"
      />
      <TagInput
        label="Critical Medications"
        values={data.criticalMedications}
        onChange={(v: string[]) => onChange("criticalMedications", v)}
        placeholder="e.g. Metformin"
      />
    </View>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────
function StepContacts({ contacts, onChange }: any) {
  const addContact = () => {
    if (contacts.length >= 3) return;
    const priorities = ["primary", "secondary", "tertiary"] as const;
    onChange([
      ...contacts,
      { id: Date.now().toString(), name: "", relationship: "", phone: "", priority: priorities[contacts.length] },
    ]);
  };

  const update = (i: number, field: string, value: string) => {
    const updated = [...contacts];
    (updated[i] as any)[field] = value;
    onChange(updated);
  };

  const remove = (i: number) =>
    onChange(contacts.filter((_: any, j: number) => j !== i));

  const labels = ["Primary", "Secondary", "Tertiary"];

  return (
    <View style={s.stepContent}>
      {contacts.map((c: any, i: number) => (
        <View key={c.id} style={s.contactCard}>
          <View style={s.contactHeader}>
            <Text style={s.contactLabel}>{labels[i]} Contact</Text>
            {i > 0 && (
              <TouchableOpacity onPress={() => remove(i)}>
                <Trash2 size={18} color={Colors.alertRed} />
              </TouchableOpacity>
            )}
          </View>
          <Field label="Name" value={c.name} onChangeText={(v: string) => update(i, "name", v)} placeholder="Full name" />
          <Field label="Relationship" value={c.relationship} onChangeText={(v: string) => update(i, "relationship", v)} placeholder="e.g. Mother" />
          <Field label="Phone" value={c.phone} onChangeText={(v: string) => update(i, "phone", v)} placeholder="+91 98765 43210" keyboardType="phone-pad" />
        </View>
      ))}

      {contacts.length < 3 && (
        <TouchableOpacity style={s.addContact} onPress={addContact}>
          <Plus color={Colors.forestGreen} size={18} />
          <Text style={s.addContactText}>Add another contact</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const { updateMany } = useProfile();

  const [step, setStep] = useState(0);

  const [personal, setPersonal] = useState({ fullName: "", dateOfBirth: "", bloodType: "" });
  const [medical, setMedical] = useState({
    allergies: [] as string[],
    conditions: [] as string[],
    criticalMedications: [] as string[],
  });
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "", relationship: "", phone: "", priority: "primary" },
  ]);

  const updatePersonal = (k: string, v: any) => setPersonal((p) => ({ ...p, [k]: v }));
  const updateMedical = (k: string, v: any) => setMedical((p) => ({ ...p, [k]: v }));

  const validateStep = () => {
    if (step === 0) {
      if (!personal.fullName.trim()) { Alert.alert("Required", "Enter your name"); return false; }
      if (!personal.dateOfBirth.trim()) { Alert.alert("Required", "Enter date of birth"); return false; }
      if (!personal.bloodType) { Alert.alert("Required", "Select a blood type"); return false; }
    }
    if (step === 2) {
      const primary = contacts[0];
      if (!primary.name.trim() || !primary.phone.trim()) {
        Alert.alert("Required", "Fill in the primary emergency contact");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  };

  const finish = async () => {
    const [day, month, year] = personal.dateOfBirth.split("-").map(Number);
    const dob = new Date(year, month - 1, day);
    const age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

    console.log("medical state at finish:", JSON.stringify(medical));
    console.log("contacts state at finish:", JSON.stringify(contacts));

    updateMany({
      fullName: personal.fullName.trim(),
      dateOfBirth: personal.dateOfBirth.trim(),
      bloodType: personal.bloodType,
      age: isNaN(age) ? 0 : age,
      allergies: medical.allergies,
      conditions: medical.conditions,
      criticalMedications: medical.criticalMedications,
      emergencyContacts: contacts.filter((c) => c.name.trim()),
    });

    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(tabs)" as any);
  };

  const progress = (step + 1) / STEPS.length;

  return (
    <SafeAreaView style={s.root}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.appName}>Vitl</Text>
        <Text style={s.stepCount}>{step + 1} / {STEPS.length}</Text>
      </View>

      {/* ── Progress bar ── */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* ── Step title ── */}
      <View style={s.titleBlock}>
        <Text style={s.title}>{STEPS[step].title}</Text>
        <Text style={s.subtitle}>{STEPS[step].subtitle}</Text>
      </View>

      {/* ── Content ── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 0 && <StepPersonal data={personal} onChange={updatePersonal} />}
          {step === 1 && <StepMedical data={medical} onChange={updateMedical} />}
          {step === 2 && <StepContacts contacts={contacts} onChange={setContacts} />}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Footer ── */}
      <View style={s.footer}>
        {step > 0 ? (
          <TouchableOpacity style={s.backBtn} onPress={() => setStep((s) => s - 1)}>
            <ChevronLeft size={20} color={Colors.forestGreen} />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity style={s.nextBtn} onPress={next}>
          <Text style={s.nextText}>{step === STEPS.length - 1 ? "Finish" : "Next"}</Text>
          {step < STEPS.length - 1 && <ChevronRight size={20} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  appName: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: Colors.forestGreen,
  },
  stepCount: {
    fontFamily: Fonts.sansRegular,
    fontSize: 13,
    color: Colors.mediumGray,
  },

  progressTrack: {
    height: 3,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 24,
    borderRadius: 2,
    marginTop: 4,
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.brandGreen,
    borderRadius: 2,
  },

  titleBlock: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: Colors.nearBlack,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.sansRegular,
    fontSize: 14,
    color: Colors.mediumGray,
  },

  stepContent: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },

  bloodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20, marginTop: 8 },
  bloodBtn: {
    width: 64,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  bloodBtnActive: { backgroundColor: Colors.forestGreen, borderColor: Colors.forestGreen },
  bloodText: { fontFamily: Fonts.sansMedium, fontSize: 15, color: Colors.nearBlack },
  bloodTextActive: { color: Colors.white },

  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  contactLabel: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    color: Colors.forestGreen,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  addContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.forestGreen,
    borderRadius: 12,
    borderStyle: "dashed",
  },
  addContactText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    color: Colors.forestGreen,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.cream,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 12, paddingHorizontal: 4 },
  backText: { fontFamily: Fonts.sansMedium, fontSize: 16, color: Colors.forestGreen },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.forestGreen,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: { fontFamily: Fonts.sansBold, fontSize: 16, color: Colors.white },
});

const f = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    color: Colors.nearBlack,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.sansRegular,
    fontSize: 15,
    color: Colors.nearBlack,
  },
  hint: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.mediumGray, marginTop: 4 },
  tagRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  addBtn: {
    backgroundColor: Colors.forestGreen,
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.forestGreen + "18",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: { fontFamily: Fonts.sansMedium, fontSize: 13, color: Colors.forestGreen },
  chipX: { fontFamily: Fonts.sansBold, fontSize: 15, color: Colors.forestGreen },
});