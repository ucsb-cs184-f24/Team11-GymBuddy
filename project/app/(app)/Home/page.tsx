import React, { useState, useEffect } from "react";
import { Button, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        // If user exists, store user information
        setUser(JSON.parse(storedUser));
      } else {
        // If no user is logged in, redirect to the login page
        router.replace("/(auth)/page");
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();

      // Remove the user token from AsyncStorage
      await AsyncStorage.removeItem("@user");

      // After successful logout, redirect to the login page
      router.replace("/(auth)/page");
    } catch (e: any) {
      // TODO - more detailed error messages
      Alert.alert("Logout failed: ", e.message);
    }
  };

  return (
    <View>
      <Text style={{ paddingTop: 100 }}>Welcome back {user?.email}</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default Home;
