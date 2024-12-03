// UserInfo.tsx
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/serviceFiles/usersDatabaseService";
import { auth } from "@/serviceFiles/authService";
import HeightPickerModal from "@/components/heightPicker";
import WeightPickerModal from "@/components/weightPicker";
import GenderPickerModal from "@/components/genderPicker";

const UserInfo = () => {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const handleContinue = async () => {
    // Validate inputs
    if (!bio.trim()) {
      Alert.alert("Validation Error", "Please enter your bio.");
      return;
    }
    if (height === null) {
      Alert.alert("Validation Error", "Please select your height.");
      return;
    }
    if (weight === null) {
      Alert.alert("Validation Error", "Please select your weight.");
      return;
    }
    if (!gender) {
      Alert.alert("Validation Error", "Please select your gender.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updateUserProfile(user.uid, {
          bio: bio.trim() || "",
          height,
          weight,
          gender,
          isPrivate,
        });
        Alert.alert("Success", "Profile information updated.");
        router.replace("/(tabs)/Home");
      } else {
        Alert.alert("Error", "No authenticated user found.");
      }
    } catch (e: any) {
      Alert.alert("Update Failed", e.message);
    }
  };

  const toggleSwitch = () => {
    setIsPrivate((previousState) => !previousState);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Enter Your Personal Info</Text>
        {/* Bio */}
        <TextInput
          placeholder="Bio"
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          placeholderTextColor="#666"
          multiline
        />

        {/* Height */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setIsHeightModalVisible(true)}
        >
          <Text style={styles.pickerButtonText}>
            {height ? `${height} cm` : "Select Height"}
          </Text>
        </TouchableOpacity>
        <HeightPickerModal
          isVisible={isHeightModalVisible}
          onClose={() => setIsHeightModalVisible(false)}
          height={height}
          onHeightChange={setHeight}
        />

        {/* Weight */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setIsWeightModalVisible(true)}
        >
          <Text style={styles.pickerButtonText}>
            {weight ? `${weight} kg` : "Select Weight"}
          </Text>
        </TouchableOpacity>
        <WeightPickerModal
          isVisible={isWeightModalVisible}
          onClose={() => setIsWeightModalVisible(false)}
          weight={weight}
          onWeightChange={setWeight}
        />

        {/* Gender */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setIsGenderModalVisible(true)}
        >
          <Text style={styles.pickerButtonText}>
            {gender ? capitalizeFirstLetter(gender) : "Select Gender"}
          </Text>
        </TouchableOpacity>
        <GenderPickerModal
          isVisible={isGenderModalVisible}
          onClose={() => setIsGenderModalVisible(false)}
          gender={gender}
          onGenderChange={setGender}
        />

        {/* Privacy Switch */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Private Profile</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isPrivate ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isPrivate}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center", // Center vertically
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
  },
  pickerButton: {
    width: "100%",
    height: 50,
    borderColor: "#3b5998",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 18,
    color: "#333",
  },
  continueButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#3b5998",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default UserInfo;