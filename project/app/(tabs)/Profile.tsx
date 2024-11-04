// Profile.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import ImagePickerComponent from "@/components/Profile/pickImage";
import UserInfoEditor from "@/components/Profile/ProfileData";
import AnalyticCharts from "@/components/Profile/AnalyticCharts";
import { checkUserExists, getProfile, getUserId } from "@/databaseService";
import { useFocusEffect } from "@react-navigation/native";

interface UserData {
  Name: string;
  Email: string;
  joined: string;
}

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [analyticsKey, setAnalyticsKey] = useState(0);
  const auth = getAuth();

  const logout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("@user");
      router.replace("/(auth)/SignIn");
      Alert.alert("Logged Out");
    } catch (error) {
      Alert.alert("Error logging out");
    }
  };

  useEffect(() => {
    checkUserExists().then(async () => {
      const profile = await getProfile(await getUserId());
      setUserData({
        Name: profile.Name,
        Email: profile.email,
        joined: new Date(Number(profile.joined)).toLocaleDateString(),
      });

      // Retrieve the saved image
      const savedImage = await AsyncStorage.getItem("@profile_image");
      if (savedImage) {
        setProfileImage(savedImage);
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Update key to trigger re-render of AnalyticCharts
      setAnalyticsKey((prevKey) => prevKey + 1);
    }, [])
  );

  const handleImageSelected = async (uri: string) => {
    setProfileImage(uri);
    // Save the new image to AsyncStorage
    try {
      await AsyncStorage.setItem("@profile_image", uri);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <ImagePickerComponent
            onImageSelected={handleImageSelected}
            initialImage={profileImage}
          />
          <UserInfoEditor
            initialName={userData?.Name || "loading"}
            initialEmail={userData?.Email || "loading"}
            initialJoined={userData?.joined || "loading"}
          />
        </View>
        <AnalyticCharts key={analyticsKey} />
        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={logout} color="#4a90e2" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  logoutContainer: {
    padding: 16,
    alignItems: "center",
  },
});
