import React, { useState, useEffect } from "react";

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
import { v4 as uuid } from "uuid";
const { width, height } = Dimensions.get("window");

const getResponsiveFontSize = (size: number) => {
  const scale = width / 375; // 375 is a base width for scaling
  const newSize = size * scale * .5;
  return Math.round(newSize);
};
interface NavbarProps {
  setModalVisible: (visible: boolean) => void;
}

const Home = () => {
  const [posts, setPosts] = useState<WorkoutLog[]>([]);
  const [newPost, setNewPost] = useState({
    exercise: "",
    duration: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const recentWorkouts = await getAllUsersRecentWorkouts();
        const postsArray = Object.values(recentWorkouts as WorkoutLog[]);
        postsArray.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(postsArray);
      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };
    loadPosts();
  }, []);

  const addPost = async () => {
    if (newPost.exercise && newPost.duration) {
      const newPostItem: WorkoutLog = {
        caption: `${newPost.exercise} for ${newPost.duration}`, // Caption derived from inputs
        commentsCount: 0,
        createdAt: Date.now(), // Current timestamp
        image: "https://example.com/placeholder.jpg", // Placeholder image
        likesCount: 0,
        exercises: [
          {
            name: newPost.exercise,
            sets: 0, // Replace with actual values if available
            reps: 0, // Replace with actual values if available
            weight: 0, // Replace with actual values if available
            category: "N/A", // Replace with appropriate category if available
          },
        ],
        userId: uuid(), // Generate unique user ID for this workout
        username: "current_user", // Replace with actual username
      };
  
      try {
        // Save the new post to the database
        await saveNewPostToDatabase(newPostItem);
        
        // Re-fetch the updated list of posts
        const recentWorkouts = await getAllUsersRecentWorkouts();
        const postsArray = Object.values(recentWorkouts as WorkoutLog[]);
        postsArray.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(postsArray);
  
        // Clear the input fields and close the modal
        setNewPost({ exercise: "", duration: "" });
        setModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to add post");
        console.error(error);
      }
    } else {
      Alert.alert("Invalid Input", "Please fill in both exercise and duration");
    }
  };
  
  const saveNewPostToDatabase = async (post: WorkoutLog) => {
    console.log("Saving new post to database:", post);
    // Implement actual save logic here
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

  const Navbar = ({ setModalVisible }: NavbarProps) => {
    return (
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Workouts</Text>
        <View style={styles.navbarIcons}>
          <TouchableOpacity style={styles.navbarIcons}>
            <Image
              source={{ uri: "https://example.com/profile-pic.jpg" }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPost = ({ item }: { item: WorkoutLog }) => (
    <BlurView intensity={80} tint="dark" style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Image
          source={{ uri: "https://example.com/profile-pic.jpg" }}
          style={styles.workoutProfilePic}
        />
        <Text style={styles.username}>{item.username}</Text>
        <TouchableOpacity
          onPress={() => {
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
        <React.Fragment key={exercise.name}>
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
        <Navbar setModalVisible={setModalVisible} />
        <View style={styles.spacer} />
        {posts.length >0 ? (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.userId}
            style={[styles.workoutList, { paddingTop: 10 }]}
          />
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
