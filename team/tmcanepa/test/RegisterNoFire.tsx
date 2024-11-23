// Register.tsx
import React, { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const register = async () => {
    if (email && password && name) {
      // Replace with your custom registration logic
      const user = { email, name, token: "dummy-auth-token" };
      await AsyncStorage.setItem("userToken", user.token);
      await AsyncStorage.setItem("userProfile", JSON.stringify(user));
      router.push("/home");
    } else {
      Alert.alert("Please fill all fields");
    }
  };

  return (
    <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
      <BlurView intensity={50} style={styles.blurView}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    width: width * 0.8,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#192f6a",
    fontWeight: "bold",
  },
});

export default Register;