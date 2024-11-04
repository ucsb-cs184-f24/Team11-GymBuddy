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
  SafeAreaView,
  Switch,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllUsersRecentWorkouts } from "@/databaseService";

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
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    exercise: "",
    duration: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Load posts when the component mounts
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
    // Save the posts to AsyncStorage whenever they are updated
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

  const Navbar = ({
    setModalVisible,
    isDarkMode,
    toggleDarkMode,
  }: NavbarProps) => {
    return (
      <View style={[styles.navbar, isDarkMode && styles.navbarDark]}>
        <TouchableOpacity
          style={[
            styles.postWorkoutButton,
            isDarkMode && styles.postWorkoutButtonDark,
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[
              styles.postWorkoutButtonText,
              isDarkMode && styles.postWorkoutButtonTextDark,
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.navbarTitle, isDarkMode && styles.navbarTitleDark]}
        >
          Workouts
        </Text>
        <View style={styles.navbarIcons}>
          <Switch
            trackColor={{
              false: "#767577",
              true: isDarkMode ? "#81b0ff" : "#81b0ff",
            }}
            thumbColor={isDarkMode ? "#f4f3f4" : "#f5dd4b"}
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
          <TouchableOpacity style={styles.navbarIcon}>
            <Image
              source={{ uri: "https://example.com/profile-pic.jpg" }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.workoutCard, isDarkMode && styles.workoutCardDark]}>
      <View style={styles.workoutHeader}>
        <Image
          source={{ uri: "https://example.com/profile-pic.jpg" }}
          style={styles.workoutProfilePic}
        />
        <Text style={[styles.username, isDarkMode && styles.usernameDark]}>
          {item.uName}
        </Text>
        <TouchableOpacity
          style={styles.moreOptions}
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
          <Text
            style={[
              styles.moreOptionsText,
              isDarkMode && styles.moreOptionsTextDark,
            ]}
          >
            •••
          </Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.workoutImage} />
      <View style={styles.workoutInfo}>
        <Text
          style={[styles.exerciseText, isDarkMode && styles.exerciseTextDark]}
        >
          {item.exercise}
        </Text>
        <Text
          style={[styles.durationText, isDarkMode && styles.durationTextDark]}
        >{`Sets: ${item.sets}, Reps: ${item.reps}`}</Text>
        <Text
          style={[styles.durationText, isDarkMode && styles.durationTextDark]}
        >{`Date: ${item.date}, Time: ${item.time}`}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <Navbar
        setModalVisible={setModalVisible}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.workoutList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalView, isDarkMode && styles.modalViewDark]}>
          <Text
            style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
          >
            Post Workout
          </Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Exercise"
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
            value={newPost.exercise}
            onChangeText={(text) =>
              setNewPost((prev) => ({ ...prev, exercise: text }))
            }
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Duration"
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
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
            <Text
              style={[
                styles.cancelButtonText,
                isDarkMode && styles.cancelButtonTextDark,
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  navbarDark: {
    backgroundColor: "#1c1c1c",
    borderBottomColor: "#2c2c2c",
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  navbarTitleDark: {
    color: "#ffffff",
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
  workoutCard: {
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  workoutCardDark: {
    backgroundColor: "#1c1c1c",
    borderBottomColor: "#2c2c2c",
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
  username: {
    fontWeight: "bold",
    flex: 1,
  },
  usernameDark: {
    color: "#ffffff",
  },
  moreOptions: {
    padding: 5,
  },
  moreOptionsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moreOptionsTextDark: {
    color: "#ffffff",
  },
  postWorkoutButton: {
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  postWorkoutButtonDark: {
    backgroundColor: "#2c2c2c",
  },
  postWorkoutButtonText: {
    fontSize: 24,
    color: "#4a90e2",
    fontWeight: "bold",
  },
  postWorkoutButtonTextDark: {
    color: "#81b0ff",
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
  },
  exerciseTextDark: {
    color: "#ffffff",
  },
  durationText: {
    color: "#666",
  },
  durationTextDark: {
    color: "#888",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewDark: {
    backgroundColor: "#1c1c1c",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalTitleDark: {
    color: "#ffffff",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#dbdbdb",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputDark: {
    borderColor: "#2c2c2c",
    color: "#ffffff",
    backgroundColor: "#2c2c2c",
  },
  addButton: {
    backgroundColor: "#0095f6",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#0095f6",
  },
  cancelButtonTextDark: {
    color: "#81b0ff",
  },
});

export default Home;
