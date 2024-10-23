import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "654847414653-kjnfgaidd1q25vah0ngodqlqoblvvbdc.apps.googleusercontent.com",
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);

      // After successful sign-in, redirect to the home page
      router.replace("/(app)/home/page");
    } catch (e: any) {
      // TODO - more detailed error messages
      Alert.alert("Sign in failed: ", e.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      // After successful sign-in, redirect to the home page
      router.replace("/(app)/home/page");
    } catch (e: any) {
      // TODO - more detailed error messages
      Alert.alert("Sign in failed: ", e.message);
    }
  };

  const handleForgotPassword = async () => {
    // TODO - handle forgot password logic
  };

  const handleCreateAccount = async () => {
    try {
      // TODO - right now, filling out email and password then pressing "Create an account"
      // creates the account. Later on, we should have a new page to create an account.

      await auth().createUserWithEmailAndPassword(email, password);
    } catch (e: any) {
      Alert.alert("Registration failed: ", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* TODO - create a logo */}
      <Image
        source={{ uri: "https://via.placeholder.com/150" }}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        autoCapitalize="none"
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={handleCreateAccount}
      >
        <Text style={styles.createAccountButtonText}>Create an account</Text>
      </TouchableOpacity>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => handleGoogleSignIn()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  forgotPasswordText: {
    color: "#007AFF",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    fontSize: 16,
    color: "#888",
    marginHorizontal: 10,
  },
  createAccountButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Login;
