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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { getAllUsersRecentWorkouts } from "@/databaseService";

const { width } = Dimensions.get("window");

interface Post {
  id: string;
  uName: string;
  area: string;
  exercise: string;
  sets: number;
  reps: number;
  date: string;
  time: string;
  image: string;
}

interface NavbarProps {
  setModalVisible: (visible: boolean) => void;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    exercise: "",
    duration: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const recentWorkouts = await getAllUsersRecentWorkouts(1);
        const postsArray = Object.entries(recentWorkouts).map(
          ([id, workout]) => ({
            id,
            uName: workout.name || "null",
            area: "N/A",
            exercise: workout.workouts.toString(),
            sets: 0,
            reps: 0,
            date: new Date(workout.date * 1000)?.toLocaleDateString() || "N/A",
            time: "N/A",
            image: "https://example.com/placeholder.jpg",
          })
        );
        setPosts(postsArray);
      } catch (error) {
        console.error("Failed to load posts", error);
      }
    };
    loadPosts();
  }, []);

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
    if (newPost.exercise && newPost.duration) {
      const newPostItem: Post = {
        id: Date.now().toString(),
        uName: "current_user",
        area: "N/A",
        exercise: newPost.exercise,
        sets: 0,
        reps: 0,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        image: "https://example.com/placeholder.jpg",
      };

      const updatedPosts = [newPostItem, ...posts];
      setPosts(updatedPosts);
      try {
        await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
      } catch (error) {
        Alert.alert("Error", "Failed to save post");
      }
      setNewPost({ exercise: "", duration: "" });
      setModalVisible(false);
    }
  };

  const deletePost = async (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    try {
      await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
    } catch (error) {
      Alert.alert("Error", "Failed to delete post");
    }
  };

  const Navbar = ({ setModalVisible }: NavbarProps) => {
    return (
      <BlurView intensity={100} tint="dark" style={styles.navbar}>
        <TouchableOpacity
          style={styles.postWorkoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.postWorkoutButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Workouts</Text>
        <View style={styles.navbarIcons}>
          <TouchableOpacity style={styles.navbarIcon}>
            <Image
              source={{ uri: "https://example.com/profile-pic.jpg" }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
      </BlurView>
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <BlurView intensity={80} tint="dark" style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Image
          source={{ uri: "https://example.com/profile-pic.jpg" }}
          style={styles.workoutProfilePic}
        />
        <Text style={styles.username}>{item.uName}</Text>
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
                  onPress: () => deletePost(item.id),
                  style: "destructive",
                },
              ]
            );
          }}
        >
          <Text style={styles.moreOptionsText}>•••</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.workoutImage} />
      <View style={styles.workoutInfo}>
        <Text style={styles.exerciseText}>{item.exercise}</Text>
        <Text style={styles.durationText}>{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
        <Text style={styles.durationText}>{`Date: ${item.date}, Time: ${item.time}`}</Text>
      </View>
    </BlurView>
  );

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <Navbar setModalVisible={setModalVisible} />
        <View style={styles.spacer} />
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          style={[styles.workoutList, { paddingTop: 10 }]}
        />
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
    paddingHorizontal: 15,
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  workoutCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  username: {
    fontWeight: "bold",
    flex: 1,
    color: "#FFFFFF",
  },
  moreOptionsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  postWorkoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  postWorkoutButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  workoutImage: {
    width: "100%",
    height: 300,
  },
  workoutInfo: {
    padding: 10,
  },
  exerciseText: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  durationText: {
    color: "rgba(255, 255, 255, 0.7)",
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
    padding: 35,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "#3b5998",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: "#FFFFFF",
  },
  navbarIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  navbarIcon: {
    marginLeft: 15,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  workoutList: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  workoutProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  spacer: {
    height: 20,
  },
});

export default Home;