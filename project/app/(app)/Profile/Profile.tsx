// Home.tsx
import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";




const Profile = () => {
  const router = useRouter(); 

  const logout = async() => {
    try {
      await auth.signOut()
      await AsyncStorage.removeItem("@user");
      router.replace("/(auth)/page");
      Alert.alert('Logged Out');
    } catch (error) {
      Alert.alert('Error logging out');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
      <Button title="Logout" onPress={logout} color="#4a90e2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Profile;