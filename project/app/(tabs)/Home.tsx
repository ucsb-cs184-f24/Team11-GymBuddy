import React, { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  getAllUsersRecentWorkouts,
  WorkoutLog,
} from "@/serviceFiles/postsDatabaseService";
import { getUserId, getAllFollowing } from "@/serviceFiles/usersDatabaseService";
import 'react-native-get-random-values';
import { v4 as uuid } from "uuid";
import { getAllUsernames, getAllUsers, getUserId, getUserProfile, UserData } from "@/serviceFiles/usersDatabaseService";
const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375; // 375 is a base width for scaling
  const newSize = size * scale * .5;
  return Math.round(newSize);
};
interface NavbarProps {
  setModalVisible: (visible: boolean) => void;
  toggleFilter: () => void;
  filterEnabled: boolean;
}

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [posts, setPosts] = useState<WorkoutLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [followingPosts, setFollowingPosts] = useState<WorkoutLog[]>([]);
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [newPost, setNewPost] = useState({
    exercise: "",
    duration: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
      loadPosts();
  }, []);
  const loadPosts = async () => {
      try {
        const recentWorkouts = await getAllUsersRecentWorkouts();
        const postsArray = Object.values(recentWorkouts as WorkoutLog[]);
        postsArray.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(postsArray);
        await loadFollowingPosts(postsArray);
      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const userIds = await getAllUsernames();
      const userProfiles: User[] = [];

      const profilePromises = userIds.map(async (userBasic) => {
        const profile = await getUserProfile(userBasic.userId);
        if (profile) {
          userProfiles.push({
            userId: userBasic.userId, 
            username: profile.username || "Unknown",
            firstName: userBasic.firstName || "",
            lastName: userBasic.lastName || "",
            profilePic: profile.profilePicture || "",
          } as User);
        }
      });

      await Promise.all(profilePromises);

      setUsers(userProfiles);
      setFilteredData(userProfiles.slice(0, 10));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  const handleRefresh = async () => {
    setRefreshing(true); // Start the refreshing animation

    await loadPosts()
      setRefreshing(false); // Stop the refreshing animation
  };


  useEffect(() => {
    const savePosts = async () => {
      try {
        await AsyncStorage.setItem("posts", JSON.stringify(posts));
      } catch (error) {
        console.error("Failed to save posts to AsyncStorage", error);
      }
    };
    savePosts();
  }, [posts]);

  const addPost = async () => {
    // if (newPost.exercise && newPost.duration) {
    //   const newPostItem: WorkoutLog = {
    //     id: Date.now().toString(),
    //     uName: "current_user",
    //     area: "N/A",
    //     exercise: newPost.exercise,
    //     sets: 0,
    //     reps: 0,
    //     date: new Date().toLocaleDateString(),
    //     time: new Date().toLocaleTimeString(),
    //     image: "https://example.com/placeholder.jpg",
    //   };
    //   const updatedPosts = [newPostItem, ...posts];
    //   setPosts(updatedPosts);
    //   try {
    //     await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
    //   } catch (error) {
    //     Alert.alert("Error", "Failed to save post");
    //   }
    //   setNewPost({ exercise: "", duration: "" });
    //   setModalVisible(false);
    //}
  };

  const deletePost = async (id: string) => {
    //   const updatedPosts = posts.filter((post) => post.id !== id);
    //   setPosts(updatedPosts);
    //   try {
    //     await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
    //   } catch (error) {
    //     Alert.alert("Error", "Failed to delete post");
    //   }
  };

  const toggleFilter = () => {
    setShowFollowingPosts((prev) => !prev);
    console.log("Filter Toggled. show FollowingPosts:", !showFollowingPosts)
  };

  const Navbar = ({ toggleFilter, filterEnabled }: NavbarProps) => {
    return (
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Workouts</Text>
        <View style={styles.navbarIcons}>
          <TouchableOpacity 
          style={styles.filterButton}
          onPress = {toggleFilter}
        >
          <Text style={styles.filterButtonText}>
            {filterEnabled ? "All" : "Following"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.navbarIcons}>
            <Image
              source={{ uri: "https://example.com/profile-pic.jpg" }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getProfilePic = (userId: string) => {
    const user = users.find((user) => user.userId === userId);
    return user?.profilePic || "https://example.com/profile-pic.jpg";
  };

  const renderPost = ({ item }: { item: WorkoutLog }) => (
    <BlurView intensity={80} tint="dark" style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Image
          source={{ uri: getProfilePic(item.userId) }}
          style={styles.workoutProfilePic}
        />
        <Text style={styles.username}>{item.username}</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert(
              "Delete Workout",
              "Are you sure you want to delete this workout?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  //onPress: () => deletePost(item.id),
                  style: "destructive",
                },
              ]
            );
          }}
        >
          <Text style={styles.moreOptionsText}>•••</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutInfo}>
      {item.exercises?.map((exercise) => (
        <React.Fragment key={uuid()}>
            <Text style = {styles.setsText}>
            {exercise.name} - {exercise.category}
            </Text>
            <Text style = {styles.setsText}>
              Sets: {exercise.sets} | Reps: {exercise.reps} | Weight: {exercise.weight}
            </Text>
        </React.Fragment>
        ))}
        <Text style={styles.durationText}>
          {`Date: ${new Date(
            item.createdAt
          ).toLocaleDateString()}, Time: ${new Date(
            item.createdAt
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`}
        </Text>
      </View>
    </BlurView>
  );

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
        <Navbar 
        setModalVisible={setModalVisible} 
        toggleFilter = {toggleFilter}
        filterEnabled = {showFollowingPosts}
        />
        <View style={styles.spacer} />
        {posts.length >0 ? (
          <>
          {console.log("rendering FlatList with data:", showFollowingPosts ? followingPosts : posts)}
          <FlatList
            data={showFollowingPosts ? followingPosts : posts}
            renderItem={renderPost}
            keyExtractor={(item) => uuid()}
            style={[styles.workoutList, { paddingTop: 10 }]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#ffd33d"]} // Customize spinner color (Android)
                tintColor="#ffd33d" // Customize spinner color (iOS)
              />
            }
          />
        </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={100} tint="dark" style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Post Workout</Text>
              <TextInput
                style={styles.input}
                placeholder="Exercise"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={newPost.exercise}
                onChangeText={(text) =>
                  setNewPost((prev) => ({ ...prev, exercise: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Duration"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={newPost.duration}
                onChangeText={(text) =>
                  setNewPost((prev) => ({ ...prev, duration: text }))
                }
              />
              <TouchableOpacity style={styles.addButton} onPress={addPost}>
                <Text style={styles.addButtonText}>Add Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: getResponsiveFontSize(15),
  },
  navbarTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  navbarIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: getResponsiveFontSize(40),
    height: getResponsiveFontSize(40),
    borderRadius: getResponsiveFontSize(20),
  },
  filterButton: { 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 5, 
    backgroundColor: "#FFFFFF" 
  },
  filterButtonText: { 
    color: "#3b5998", 
    fontWeight: "bold" 
  },
  workoutCard: {
    marginBottom: getResponsiveFontSize(10),
    borderRadius: 10,
    overflow: "hidden",
    padding: getResponsiveFontSize(10),
  },
  username: {
    fontWeight: "bold",
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: "#FFFFFF",
  },
  moreOptionsText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  workoutInfo: {
    padding: getResponsiveFontSize(10),
  },
  exerciseText: {
    fontWeight: "bold",
    fontSize: getResponsiveFontSize(14),
    marginBottom: getResponsiveFontSize(5),
    color: "#FFFFFF",
  },
  setsRepsText: {
    fontSize: getResponsiveFontSize(14),
    color: "white",
  },
  durationText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: getResponsiveFontSize(12),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: getResponsiveFontSize(35),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    marginBottom: getResponsiveFontSize(15),
    color: "#FFFFFF",
  },
  input: {
    height: getResponsiveFontSize(40),
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    marginBottom: getResponsiveFontSize(10),
    paddingHorizontal: getResponsiveFontSize(10),
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    padding: getResponsiveFontSize(10),
    borderRadius: 5,
    marginTop: getResponsiveFontSize(10),
  },
  addButtonText: {
    color: "#3b5998",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: getResponsiveFontSize(15),
  },
  cancelButtonText: {
    color: "#FFFFFF",
  },
  workoutList: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveFontSize(10),
  },
  workoutProfilePic: {
    width: getResponsiveFontSize(40),
    height: getResponsiveFontSize(40),
    borderRadius: getResponsiveFontSize(20),
    marginRight: getResponsiveFontSize(10),
  },
  spacer: {
    height: getResponsiveFontSize(20),
  },
  setsText: {
    color: 'white', // Set text color to white
    fontSize: 16,    // Adjust font size as needed
    fontWeight: '500', // Optional: Add font weight for better visibility
    marginTop: 4,    // Optional: Add margin for spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 30,
  },
});
export default Home;
