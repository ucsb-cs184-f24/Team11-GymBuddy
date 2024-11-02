// import React, { useState } from "react";
// import {
//   Text,
//   View,
//   Alert,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useRouter } from "expo-router";
// import { auth } from "@/firebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   // Handle Sign-in (existing users)
//   const handleSignIn = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       // Save user session in AsyncStorage
//       await AsyncStorage.setItem("@user", JSON.stringify(user));

//       // After successful sign-in, redirect to the home page
//       router.replace("/(tabs)/Home");
//     } catch (e: any) {
//       // TODO - more detailed error messages
//       Alert.alert("Sign in failed: ", e.message);
//     }
//   };

//   // Handle Create Account (new users)
//   const handleCreateAccount = async () => {
//     try {
//       //switch to Register page
//       router.replace("/(auth)/Register");
//     } catch (e: any) {
//       Alert.alert("Registration failed: ", e.message);
//     }
//   };

//   const handleForgotPassword = async () => {
//     // TODO - handle forgot password logic
//   };

//   return (
//     <View style={styles.container}>
//       {/* TODO - create a logo */}
//       <Image
//         source={require("../../assets/logo.png")}
//         style={styles.logo}
//       />
//       <Text style={styles.title}>Sign in</Text>
//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         autoCapitalize="none"
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TextInput
//         placeholder="Password"
//         style={styles.input}
//         value={password}
//         autoCapitalize="none"
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity onPress={handleForgotPassword}>
//         <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
//         <Text style={styles.signInButtonText}>Sign in</Text>
//       </TouchableOpacity>
//       <View style={styles.orContainer}>
//         <View style={styles.line} />
//         <Text style={styles.orText}>or</Text>
//         <View style={styles.line} />
//       </View>
//       <TouchableOpacity
//         style={styles.createAccountButton}
//         onPress={handleCreateAccount}
//       >
//         <Text style={styles.createAccountButtonText}>Create an account</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     fontSize: 16,
//   },
//   forgotPasswordText: {
//     color: "#007AFF",
//     marginBottom: 20,
//     alignSelf: "flex-start",
//   },
//   signInButton: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#007AFF",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   signInButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   orContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginVertical: 10,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#ccc",
//   },
//   orText: {
//     fontSize: 16,
//     color: "#888",
//     marginHorizontal: 10,
//   },
//   createAccountButton: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   createAccountButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default Login;
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      router.replace("/(tabs)/Home");
    } catch (e: any) {
      Alert.alert("Sign in failed", e.message);
    }
  };

  const handleCreateAccount = async () => {
    try {
      router.replace("/(auth)/Register");
    } catch (e: any) {
      Alert.alert("Navigation failed", e.message);
    }
  };

  const handleForgotPassword = async () => {
    Alert.alert("Forgot Password", "This feature is not implemented yet.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <BlurView intensity={10} tint="dark" style={styles.header}>
          <Text style={styles.headerTitle}>Sign In</Text>
        </BlurView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <BlurView intensity={100} style={styles.blurContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Welcome Back</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={email}
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor="#A0A0A0"
                />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  value={password}
                  autoCapitalize="none"
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#A0A0A0"
                />
              </View>
              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Sign In</Text>
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
            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
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
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
  forgotPasswordButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 20,
  },
  signInButtonText: {
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
  createAccountButton: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Login;