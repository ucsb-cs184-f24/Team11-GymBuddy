import { Stack, useRouter } from "expo-router";
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
        router.replace("/(tabs)/Home/Home");
      } else {
        // If no user, redirect to login page
        router.replace("/(auth)/SignIn");
      }
    };
    checkUser(); // Call function to check user on component mount
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default RootLayout;