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
import ImagePickerComponent from '../../components/Profile/pickImage'
import { checkUserExists, getProfile, getUserData, getUserId } from '@/databaseService';
import UserInfoEditor from '../../components/Profile/ProfileData';
import { get } from 'firebase/database';

interface UserData {
  Name: string;
  Email: string;
  joined: string;
}

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
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

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const storedUser = await AsyncStorage.getItem("@user");
  //     if (storedUser) {
  //       setUser(JSON.parse(storedUser));
  //       console.log(JSON.parse(storedUser));
  //     } else {
  //       router.replace("/(auth)/SignIn");
  //     }
  //   };
  //   checkUser();
  // }, []);

  useEffect(() => {
    checkUserExists().then(async () => {
      const profile = await getProfile(await getUserId())
      console.log(profile)
      setUserData({
        Name: profile.Name,
        Email: profile.email,
        joined: new Date(Number(profile.joined)).toLocaleDateString(),
      });

    })
  }, [])

  useEffect(() => {
    console.log(userData)
  }, [userData])

  const handleImageSelected = (uri: string) => {
    setProfileImage(uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.content}>
          <ImagePickerComponent
            onImageSelected={handleImageSelected}
            initialImage={profileImage}
          />
          <UserInfoEditor
            initialName={userData?.Name || 'loading'}
            initialEmail={userData?.Email|| 'loading'}
            initialJoined={userData?.joined || 'loading'}
          />
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
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
