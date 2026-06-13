import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Trash2, Plus, Save } from "lucide-react-native";

import { useProfile } from "../context/ProfileContext";
import Colors from "../constants/colors";
import { Fonts } from "../constants/fonts";

export default function EmergencyContactsScreen() {
  const router = useRouter();

  const {
    profile,
    addEmergencyContact,
    removeEmergencyContact,
    updateField,
  } = useProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const addContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing Information", "Name and phone are required.");
      return;
    }

    addEmergencyContact({
      id: Date.now().toString(),
      name,
      phone,
      relationship,
      priority: profile.emergencyContacts.length === 0
        ? "primary"
        : "secondary",
    });

    setName("");
    setPhone("");
    setRelationship("");
  };

  const editContact = (
    id: string,
    field: "name" | "phone" | "relationship",
    value: string
  ) => {
    const updatedContacts = profile.emergencyContacts.map((contact) =>
      contact.id === id
        ? { ...contact, [field]: value }
        : contact
    );

    updateField("emergencyContacts", updatedContacts);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Emergency Contacts</Text>

        {profile.emergencyContacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <TextInput
              style={styles.input}
              value={contact.name}
              placeholder="Name"
              onChangeText={(text) =>
                editContact(contact.id, "name", text)
              }
            />

            <TextInput
              style={styles.input}
              value={contact.phone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={(text) =>
                editContact(contact.id, "phone", text)
              }
            />

            <TextInput
              style={styles.input}
              value={contact.relationship}
              placeholder="Relationship"
              onChangeText={(text) =>
                editContact(contact.id, "relationship", text)
              }
            />

            <View style={styles.contactFooter}>
              <Text style={styles.priority}>
                {contact.priority.toUpperCase()}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  removeEmergencyContact(contact.id)
                }
              >
                <Trash2 size={20} color={Colors.alertRed} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add Contact</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={styles.input}
            placeholder="Relationship"
            value={relationship}
            onChangeText={setRelationship}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addContact}
          >
            <Plus size={18} color={Colors.white} />
            <Text style={styles.addButtonText}>
              Add Contact
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.back()}
        >
          <Save size={18} color={Colors.white} />
          <Text style={styles.saveButtonText}>
            Done
          </Text>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: Colors.nearBlack,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.sansBold,
    fontSize: 16,
    marginBottom: 12,
    color: Colors.nearBlack,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontFamily: Fonts.sansRegular,
  },
  contactFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priority: {
    fontFamily: Fonts.sansBold,
    fontSize: 12,
    color: Colors.mediumGray,
  },
  addSection: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontFamily: Fonts.sansBold,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: Colors.forestGreen,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontFamily: Fonts.sansBold,
  },
});