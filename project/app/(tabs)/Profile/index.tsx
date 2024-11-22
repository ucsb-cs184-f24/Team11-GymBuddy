import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
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
import { getUserProfile, getUserId } from "@/serviceFiles/usersDatabaseService";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { getWorkouts } from "@/serviceFiles/postsDatabaseService";


const { width } = Dimensions.get("window");

interface UserData {
  bio: string;
  createdAt: number;
  email: string;
  firstName: string;
  followerCount: number;
  followingCount: number;
  isPrivate: boolean;
  lastName: string;
  profilePicture: string;
  username: string;
}

interface WorkoutLog {
  caption: string;
  commentsCount: number;
  createdAt: number;
  image: string;
  likesCount: number;
  muscleGroup: string;
  repsCount: number;
  setsCount: number;
  userId: string;
  weight: number;
  workoutName: string;
  workoutType: string;
  username?: string;
}

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<WorkoutLog[] | null>(null);
  const [analyticsKey, setAnalyticsKey] = useState(0);
  const auth = getAuth();

  const imageUrls = [
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
  ];

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
      const profile = await getUserProfile(await getUserId()) as UserData;
      if (profile) {
        setUserData(profile);
      } else {
        console.error("Profile data is undefined");
      }
      const posts = await getWorkouts(await getUserId()) as WorkoutLog[];
      if (posts) {
        setUserPosts(posts);
      } else {
        console.error("Profile posts are undefined");
      }
    };
    fetchData();
  }, []);

  const handleImageSelected = async (uri: string) => {
    setProfileImage(uri);
    try {
      await AsyncStorage.setItem("@profile_image", uri);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    // <LinearGradient
    //   colors={["#4c669f", "#3b5998", "#192f6a"]}
    //   style={styles.container}
    // >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* <BlurView intensity={80} tint="dark" style={styles.contentBlur}>
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
          </BlurView> */}
          <Text style={styles.username}>
            {userData?.username || "loading"}
          </Text>
          <View style={styles.profileInfo}>
            <Image
              source={{uri: userData?.profilePicture}}
              style={styles.profileImage}
            />
            <View style={styles.postText}>
              <Text style={styles.numberCenter}>
                {userPosts?.length || 0}
              </Text>
              <Text style={styles.textCenter}>
                Posts
              </Text>
            </View>
            <View style={styles.followerText}>
              <Text style={styles.numberCenter}>
                {userData?.followerCount || 0}
              </Text>
              <Text style={styles.textCenter}>
                Followers
              </Text>
            </View>
            <View style={styles.followText}>
              <Text style={styles.numberCenter}>
                {userData?.followingCount || 0}
              </Text>
              <Text style={styles.textCenter}>
                Following
              </Text>
            </View>
          </View>
          <Text style={styles.name}>
            {userData?.firstName || 'loading'} {userData?.lastName || 'loading'}
          </Text>
          <Text style={styles.bio}>
            {userData?.bio || 'loading'}
          </Text>
          <Pressable style={styles.button} onPress={() => router.push('/Profile/edit')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={logout}>
            <Text style={styles.editProfileText}>Logout</Text>
          </Pressable>
          <View style={styles.viewPostsButton}>
            <MaterialCommunityIcons name="grid" size={30} color="#000"/>
          </View>
          <View style={styles.postGrid}>
            {imageUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.postImage} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    // </LinearGradient>
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
  username: {
    top: 10,
    left: 50,
    fontSize: 30,
    fontWeight: "600"
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    top: 30,
    left: 20,
    // borderWidth: 1,
    // borderColor: "black",
    maxHeight: 100
  },
  postText: {
    flex: 1,
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "black",
    top: 30,
    maxHeight: 50
  },
  followText: {
    flex: 1,
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "black",
    top: 30,
    maxHeight: 50
  },
  followerText: {
    flex: 1,
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "black",
    top: 30,
    maxHeight: 50
  },
  numberCenter: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800"
  },
  textCenter: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "300"
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "blue",
  },
  name: {
    top: 30,
    left: 20,
    width: "90%",
    fontSize: 20,
    fontWeight: "600",
    // borderWidth: 1,
    // borderColor: "black",
  },
  bio: {
    top: 35,
    left: 20,
    width: "90%",
    fontSize: 16,
    fontWeight: "300",
    // borderWidth: 1,
    // borderColor: "black",
  },
  button: {
    top: 40, 
    alignSelf: "center",
    width: "40%",
    height: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  viewPostsButton: {
    top: 45,
    alignSelf: "center",
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  editProfileText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500"
  },
  postGrid: {
    top: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Spread out images evenly across the row
    width: '100%',
  },
  postImage: {
    width: width / 3 - 2,
    height: width / 3,
    margin: 1,
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