import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

interface UserInfoEditorProps {
  initialName: string | undefined;
  initialEmail: string | undefined;
  initialJoined: string | undefined;
}

export default function UserInfoEditor({
  initialName,
  initialEmail,
  initialJoined,
}: UserInfoEditorProps) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [joinDate, setJoinDate] = useState(initialJoined || "");

  useEffect(() => {
    setName(initialName || "");
    setEmail(initialEmail || "");
    setJoinDate(initialJoined || "");
  }, [initialName, initialEmail, initialJoined]);

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Joined</Text>
        <Text style={styles.value}>{joinDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    maxWidth: 400,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 3,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#1F2937",
  },
  input: {
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 8,
  },
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
