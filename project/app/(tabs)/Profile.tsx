// Profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import ImagePickerComponent from "@/components/Profile/pickImage";
import UserInfoEditor from "@/components/Profile/ProfileData";
import AnalyticCharts from "@/components/Profile/AnalyticCharts";

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
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
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.replace("/(auth)/SignIn");
      }
    };
    checkUser();
  }, []);

  const handleImageSelected = (uri: string) => {
    setProfileImage(uri);
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
            initialName={user?.displayName || ""}
            initialEmail={user?.email || ""}
          />
        </View>
        <AnalyticCharts />
        <View style={styles.container}>
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
  text: {
    fontSize: 16,
    color: "#111827",
    marginVertical: 8,
  },
});
