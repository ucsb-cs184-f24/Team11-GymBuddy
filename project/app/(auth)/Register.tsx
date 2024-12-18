import {
  createUserProfile,
  updateUserProfile,
} from "@/serviceFiles/usersDatabaseService";
import { auth } from "@/serviceFiles/authService";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import * as Haptics from 'expo-haptics';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const { width } = Dimensions.get("window");

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSignUp = async () => {
    if (!firstName.trim()) {
      Alert.alert("Validation Error", "Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      Alert.alert("Validation Error", "Please enter your last name.");
      return;
    }
    if (!userName.trim()) {
      Alert.alert("Validation Error", "Please enter a username.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Validation Error", "Please enter your password.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      // Alert.alert("User Created");

      await createUserProfile(user.uid);
      await updateUserProfile(user.uid, {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        email: email,
        profilePicture:
          "https://i.sstatic.net/l60Hf.png",
      });
      router.replace("./UserInfo");
      // router.replace("/(tabs)/Home");
    } catch (e: any) {
      Alert.alert("Registration Failed", e.message);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/(auth)/SignIn");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.gradient}
      >
        <BlurView intensity={10} tint="dark" style={styles.header}></BlurView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View style={[styles.content, { opacity: 100 }]}>
            <BlurView intensity={100} style={styles.blurContainer}>
              <Text style={styles.title}>Create Account</Text>
              <View style={styles.inputContainer}>
              <View style={styles.nameContainer}>
                  <TextInput
                    placeholder="First Name"
                    style={[styles.input, styles.nameInput]}
                    value={firstName}
                    autoCapitalize="words"
                    onChangeText={setFirstName}
                    placeholderTextColor="#FFFFFFFF"
                  />
                  <TextInput
                    placeholder="Last Name"
                    style={[styles.input, styles.nameInput]}
                    value={lastName}
                    autoCapitalize="words"
                    onChangeText={setLastName}
                    placeholderTextColor="#FFFFFFFF"
                  />
                </View>
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholderTextColor="#FFFFFFFF"
                  autoCapitalize="none" // No automatic capitalization
                  autoCorrect={false} // Disables auto-correction
                  textContentType="none" // No suggestions or text prediction
                  keyboardType="default" // Optional: keeps keyboard behavior standard
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={email}
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor="#FFFFFFFF"
                />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  value={password}
                  autoCapitalize="none"
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#FFFFFFFF"
                />
              </View>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={handleBackToLogin}
              >
                <Text style={styles.backToLoginButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  blurContainer: {
    width: width - 40,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  nameInput: {
    width: "48%",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: "#FFFFFF",
  },
  signUpButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#3b5998",
    fontSize: 18,
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  orText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginHorizontal: 10,
  },
  backToLoginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  backToLoginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Register;