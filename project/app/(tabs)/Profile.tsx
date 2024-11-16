import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  Dimensions,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";
import ImagePickerComponent from "@/components/Profile/pickImage";
import UserInfoEditor from "@/components/Profile/ProfileData";
import AnalyticCharts from "@/components/Profile/AnalyticCharts";
import { getUserProfile, getUserId } from "@/serviceFiles/databaseService";

const { width } = Dimensions.get("window");

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
    const fetchData = async () => {
      const profile = await getUserProfile(await getUserId());
      setUserData({
        Name: profile?.Name || 'loading',
        Email: profile?.email || 'loading',
        joined: new Date(Number(profile?.joined)).toLocaleDateString() || 'loading',
      });

      const savedImage = await AsyncStorage.getItem("@profile_image");
      if (savedImage) {
        setProfileImage(savedImage);
      }
    };

    fetchData();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     setAnalyticsKey((prevKey) => prevKey + 1);
  //   }, [])
  // );

  const handleImageSelected = async (uri: string) => {
    setProfileImage(uri);
    try {
      await AsyncStorage.setItem("@profile_image", uri);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BlurView intensity={80} tint="dark" style={styles.contentBlur}>
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
          </BlurView>
          <BlurView intensity={80} tint="dark" style={styles.analyticsBlur}>
            <AnalyticCharts key={analyticsKey} />
          </BlurView>
          <BlurView intensity={80} tint="dark" style={styles.logoutBlur}>
            <TouchableOpacity style={styles.logoutContainer} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentBlur: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  analyticsBlur: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  logoutBlur: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  logoutContainer: {
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
});
