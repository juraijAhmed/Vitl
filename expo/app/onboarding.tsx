import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfile } from '../context/ProfileContext';
import type { EmergencyContact } from '../models/Profile';
import { Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react-native';

const ONBOARDING_KEY = 'vitl_onboarding_complete';

const ACCENT = '#2563EB';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const BG = '#F9FAFB';

// ─── Step configs ────────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Personal Info', subtitle: 'Basic details for your medical ID' },
  { title: 'Medical Details', subtitle: 'Allergies, conditions, medications' },
  { title: 'Emergency Contact', subtitle: 'Who should responders call first?' },
];

// ─── Reusable field components ───────────────────────────────────────────────
function Field({
  label, value, onChangeText, placeholder, keyboardType = 'default', hint,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  hint?: string;
}) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        style={f.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={MUTED}
        keyboardType={keyboardType}
        autoCorrect={false}
      />
      {hint ? <Text style={f.hint}>{hint}</Text> : null}
    </View>
  );
}

function TagInput({
  label, values, onChange, placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState('');
  const add = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setText('');
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
          placeholderTextColor={MUTED}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={f.addBtn} onPress={add}>
          <Plus size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={f.chips}>
        {values.map((v, i) => (
          <TouchableOpacity key={i} style={f.chip} onPress={() => onChange(values.filter((_, j) => j !== i))}>
            <Text style={f.chipText}>{v}</Text>
            <Text style={f.chipX}>×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Step 1: Personal Info ───────────────────────────────────────────────────
function StepPersonal({ data, onChange }: { data: any; onChange: (k: string, v: any) => void }) {
  const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
  return (
    <ScrollView contentContainerStyle={s.stepContent} keyboardShouldPersistTaps="handled">
      <Field label="Full Name" value={data.fullName} onChangeText={v => onChange('fullName', v)} placeholder="Jane Doe" />
      <Field label="Date of Birth" value={data.dateOfBirth} onChangeText={v => onChange('dateOfBirth', v)} placeholder="DD-MM-YYYY" hint="Format: DD-MM-YYYY" />
      <Text style={f.label}>Blood Type</Text>
      <View style={s.bloodGrid}>
        {BLOOD_TYPES.map(bt => (
          <TouchableOpacity
            key={bt}
            style={[s.bloodBtn, data.bloodType === bt && s.bloodBtnActive]}
            onPress={() => onChange('bloodType', bt)}
          >
            <Text style={[s.bloodText, data.bloodType === bt && s.bloodTextActive]}>{bt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Step 2: Medical Details ─────────────────────────────────────────────────
function StepMedical({ data, onChange }: { data: any; onChange: (k: string, v: any) => void }) {
  return (
    <ScrollView contentContainerStyle={s.stepContent} keyboardShouldPersistTaps="handled">
      <TagInput label="Allergies" values={data.allergies} onChange={v => onChange('allergies', v)} placeholder="e.g. Penicillin" />
      <TagInput label="Medical Conditions" values={data.conditions} onChange={v => onChange('conditions', v)} placeholder="e.g. Type 2 Diabetes" />
      <TagInput label="Critical Medications" values={data.criticalMedications} onChange={v => onChange('criticalMedications', v)} placeholder="e.g. Metformin 500mg" />
    </ScrollView>
  );
}

// ─── Step 3: Emergency Contact ───────────────────────────────────────────────
function StepContacts({ contacts, onChange }: { contacts: EmergencyContact[]; onChange: (v: EmergencyContact[]) => void }) {
  const addContact = () => {
    if (contacts.length >= 3) return;
    const priorities: EmergencyContact['priority'][] = ['primary', 'secondary', 'tertiary'];
    onChange([...contacts, {
      id: Date.now().toString(),
      name: '', relationship: '', phone: '',
      priority: priorities[contacts.length],
    }]);
  };
  const update = (i: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...contacts];
    (updated[i] as any)[field] = value;
    onChange(updated);
  };
  const remove = (i: number) => onChange(contacts.filter((_, j) => j !== i));
  const labels = ['Primary', 'Secondary', 'Tertiary'];

  return (
    <ScrollView contentContainerStyle={s.stepContent} keyboardShouldPersistTaps="handled">
      {contacts.map((c, i) => (
        <View key={c.id} style={s.contactCard}>
          <View style={s.contactHeader}>
            <Text style={s.contactLabel}>{labels[i]} Contact</Text>
            {i > 0 && (
              <TouchableOpacity onPress={() => remove(i)}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
          <Field label="Name" value={c.name} onChangeText={v => update(i, 'name', v)} placeholder="Full name" />
          <Field label="Relationship" value={c.relationship} onChangeText={v => update(i, 'relationship', v)} placeholder="e.g. Mother" />
          <Field label="Phone" value={c.phone} onChangeText={v => update(i, 'phone', v)} placeholder="+91 98765 43210" keyboardType="phone-pad" />
        </View>
      ))}
      {contacts.length < 3 && (
        <TouchableOpacity style={s.addContact} onPress={addContact}>
          <Plus size={18} color={ACCENT} />
          <Text style={s.addContactText}>Add another contact</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ─── Main Onboarding Screen ──────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const { updateField } = useProfile();
  const [step, setStep] = useState(0);

  const [personal, setPersonal] = useState({ fullName: '', dateOfBirth: '', bloodType: '' });
  const [medical, setMedical] = useState({ allergies: [] as string[], conditions: [] as string[], criticalMedications: [] as string[] });
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: '', relationship: '', phone: '', priority: 'primary' },
  ]);

  const updatePersonal = (k: string, v: any) => setPersonal(p => ({ ...p, [k]: v }));
  const updateMedical = (k: string, v: any) => setMedical(p => ({ ...p, [k]: v }));

  const validateStep = () => {
    if (step === 0) {
      if (!personal.fullName.trim()) { Alert.alert('Required', 'Please enter your full name.'); return false; }
      if (!personal.dateOfBirth.trim()) { Alert.alert('Required', 'Please enter your date of birth.'); return false; }
      if (!personal.bloodType) { Alert.alert('Required', 'Please select your blood type.'); return false; }
    }
    if (step === 2) {
      const primary = contacts[0];
      if (!primary.name.trim() || !primary.phone.trim()) {
        Alert.alert('Required', 'Please fill in your primary emergency contact.'); return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    finish();
  };

  const finish = async () => {
    // Calculate age from DOB
    const [day, month, year] = personal.dateOfBirth.split('-').map(Number);
    const dob = new Date(year, month - 1, day);
    const age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

    updateField('fullName', personal.fullName.trim());
    updateField('dateOfBirth', personal.dateOfBirth.trim());
    updateField('bloodType', personal.bloodType);
    updateField('age', isNaN(age) ? 0 : age);
    updateField('allergies', medical.allergies);
    updateField('conditions', medical.conditions);
    updateField('criticalMedications', medical.criticalMedications);
    updateField('emergencyContacts', contacts.filter(c => c.name.trim()));

    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)' as any);
  };

  const progress = (step + 1) / STEPS.length;

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.appName}>vitl</Text>
        <Text style={s.stepCount}>{step + 1} / {STEPS.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Step title */}
      <View style={s.titleBlock}>
        <Text style={s.title}>{STEPS[step].title}</Text>
        <Text style={s.subtitle}>{STEPS[step].subtitle}</Text>
      </View>

      {/* Step content */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 0 && <StepPersonal data={personal} onChange={updatePersonal} />}
        {step === 1 && <StepMedical data={medical} onChange={updateMedical} />}
        {step === 2 && <StepContacts contacts={contacts} onChange={setContacts} />}
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={s.footer}>
        {step > 0 ? (
          <TouchableOpacity style={s.backBtn} onPress={() => setStep(s => s - 1)}>
            <ChevronLeft size={20} color={ACCENT} />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>
        ) : <View />}
        <TouchableOpacity style={s.nextBtn} onPress={next}>
          <Text style={s.nextText}>{step === STEPS.length - 1 ? 'Finish' : 'Next'}</Text>
          {step < STEPS.length - 1 && <ChevronRight size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4 },
  appName: { fontSize: 22, fontWeight: '800', color: ACCENT, letterSpacing: -0.5 },
  stepCount: { fontSize: 13, color: MUTED, fontWeight: '500' },
  progressTrack: { height: 3, backgroundColor: BORDER, marginHorizontal: 24, borderRadius: 2 },
  progressFill: { height: 3, backgroundColor: ACCENT, borderRadius: 2 },
  titleBlock: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: MUTED },
  stepContent: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 },
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bloodBtn: { width: 64, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  bloodBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  bloodText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  bloodTextActive: { color: '#fff' },
  contactCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: BORDER },
  contactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  contactLabel: { fontSize: 13, fontWeight: '600', color: ACCENT, textTransform: 'uppercase', letterSpacing: 0.5 },
  addContact: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, justifyContent: 'center', borderWidth: 1.5, borderColor: ACCENT, borderRadius: 12, borderStyle: 'dashed' },
  addContactText: { fontSize: 15, color: ACCENT, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: BORDER },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 12, paddingHorizontal: 4 },
  backText: { fontSize: 16, color: ACCENT, fontWeight: '500' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  nextText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});

const f = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827' },
  hint: { fontSize: 12, color: MUTED, marginTop: 4 },
  tagRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: { backgroundColor: ACCENT, width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ACCENT + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 13, color: ACCENT, fontWeight: '500' },
  chipX: { fontSize: 15, color: ACCENT, fontWeight: '700' },
});