import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Text,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getUserProfile, getUserId } from "@/serviceFiles/usersDatabaseService";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getWorkouts } from "@/serviceFiles/postsDatabaseService";

const { width } = Dimensions.get("window");

interface UserData {
  bio: string;
  createdAt: number;
  email: string;
  firstName: string;
  followerCount: number;
  followingCount: number;
  gender: string;
  height: number | null;
  isPrivate: boolean;
  lastName: string;
  profilePicture: string;
  username: string;
  weight: number | null;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<WorkoutLog[] | null>(null);

  const imageUrls = [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const profile = (await getUserProfile(await getUserId())) as UserData;
      if (profile) {
        setUserData(profile);
      } else {
        console.error("Profile data is undefined");
      }
      const posts = (await getWorkouts(await getUserId())) as WorkoutLog[];
      if (posts) {
        setUserPosts(posts);
      } else {
        console.error("Profile posts are undefined");
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.usernameContainer}>
        {userData?.isPrivate && (
          <MaterialIcons name="lock" size={20} color="gray" />
        )}
        <Text style={styles.usernameText}>
          {userData?.username || "loading"}
        </Text>
      </View>

      <ScrollView>
        <View style={styles.statsContainer}>
          <Image
            source={{ uri: userData?.profilePicture }}
            style={styles.profileImage}
          />
          <View style={styles.stat}>
            <Text style={styles.numberCenter}>{userPosts?.length || 0}</Text>
            <Text style={styles.textCenter}>posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.numberCenter}>
              {userData?.followerCount || 0}
            </Text>
            <Text style={styles.textCenter}>followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.numberCenter}>
              {userData?.followingCount || 0}
            </Text>
            <Text style={styles.textCenter}>following</Text>
          </View>
        </View>
        <View style={styles.nameAndBioContainer}>
          <Text style={styles.name}>
            {userData?.firstName || "loading"} {userData?.lastName || "loading"}
          </Text>
          <Text style={styles.bio}>{userData?.bio || "loading"}</Text>
        </View>
        <View style={styles.buttonAndIconContainer}>
          <Pressable
            style={styles.editProfileButton}
            onPress={() => router.push("/Profile/edit")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>

          <View style={styles.viewPostsButton}>
            <MaterialCommunityIcons name="grid" size={30} color="#000" />
          </View>
        </View>
        <View style={styles.postGrid}>
          {imageUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.postImage} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 5,
    gap: 5,
  },
  usernameText: {
    fontSize: 30,
    fontWeight: "600",
  },
  statsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    height: 140,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "blue",
  },
  stat: {
    flex: 1,
    margin: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  numberCenter: {
    fontSize: 23,
    fontWeight: "700",
  },
  textCenter: {
    fontSize: 15,
    fontWeight: "400",
  },
  nameAndBioContainer: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  name: {
    paddingHorizontal: 20,
    fontSize: 21,
    fontWeight: "600",
  },
  bio: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "400",
  },
  buttonAndIconContainer: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 17,
    paddingBottom: 5,
    gap: 15,
  },
  editProfileButton: {
    width: "33%",
    height: 33,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
  },
  editProfileText: {
    fontSize: 18,
    fontWeight: "500",
  },
  viewPostsButton: {
    borderRadius: 5,
  },
  signOutText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500"
  },
  postGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  postImage: {
    width: width / 3 - 2,
    height: width / 3,
    margin: 1,
  },
});
