import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For token storage

const RootLayout = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // Get the user from AsyncStorage
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        // If user exists, redirect to the home page
        router.replace("/(app)/Home/Home");
      } else {
        // If no user, redirect to login page
        router.replace("/(auth)/page");
      }
    };
    checkUser(); // Call function to check user on component mount
  }, []);

  return <Slot />;
}

export default RootLayout;