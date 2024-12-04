import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Text,
  Dimensions,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const imageUrls = Array(30).fill("https://via.placeholder.com/300");

  const fetchUserData = useCallback(async () => {
    try {
      const userId = await getUserId();
      const profile = (await getUserProfile(userId)) as UserData;
      if (profile) {
        setUserData(profile);
      } else {
        console.error("Profile data is undefined");
      }
      const posts = (await getWorkouts(userId)) as WorkoutLog[];
      if (posts) {
        setUserPosts(posts);
      } else {
        console.error("Profile posts are undefined");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    const intervalId = setInterval(fetchUserData, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

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

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <Image
            source={{ uri: userData?.profilePicture }}
            style={styles.profileImage}
          />
          <View style={styles.stat}>
            <Text style={styles.numberCenter}>{userPosts?.length || 0}</Text>
            <Text style={styles.textCenter}>posts</Text>
          </View>
          <Pressable
            style={styles.stat}
            onPress={() => router.push("/Profile/followers")}
          >
            <Text style={styles.numberCenter}>
              {userData?.followerCount || 0}
            </Text>
            <Text style={styles.textCenter}>followers</Text>
          </Pressable>
          <Pressable
            style={styles.stat}
            onPress={() => router.push("/Profile/following")}
          >
            <Text style={styles.numberCenter}>
              {userData?.followingCount || 0}
            </Text>
            <Text style={styles.textCenter}>following</Text>
          </Pressable>
        </View>
        <View style={styles.nameAndBioContainer}>
          <View style={styles.nameAndRequestsContainer}>
            <Text style={styles.name}>
              {userData?.firstName || "loading"}{" "}
              {userData?.lastName || "loading"}
            </Text>
            <Pressable
              style={styles.followReqsButton}
              onPress={() => router.push("/Profile/requests")}
            >
              <Text style={styles.followReqsText}>Follow Requests</Text>
            </Pressable>
          </View>
          <Text style={styles.bio}>{userData?.bio || "loading"}</Text>
        </View>

        <View style={styles.buttonAndIconContainer}>
          <Pressable
            style={styles.editProfileButton}
            onPress={() => router.push("/Profile/edit")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>

          <MaterialCommunityIcons name="grid" size={30} color="#000" />
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
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 0.25 * width,
    height: 0.25 * width,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "blue",
  },
  stat: {
    flex: 1,
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
    fontSize: (13 * width) / 375,
    fontWeight: "400",
  },
  nameAndBioContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  nameAndRequestsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  name: {
    fontSize: 21,
    fontWeight: "600",
  },
  bio: {
    fontSize: 16,
    fontWeight: "400",
  },
  buttonAndIconContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
  },
  editProfileButton: {
    width: 150,
    height: 33,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "500",
  },
  followReqsButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },
  followReqsText: {
    fontSize: 14,
    fontWeight: "500",
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
