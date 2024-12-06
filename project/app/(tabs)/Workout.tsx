import {
  createPost,
  getWorkouts,
  WorkoutLog,
} from "@/serviceFiles/postsDatabaseService";
import { getUserId } from "@/serviceFiles/usersDatabaseService";
import { workoutsByCategory } from "@/utils/Workout/workoutCatagory";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WorkoutScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);
  const [previousWorkouts, setPreviousWorkouts] = useState<WorkoutLog[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState<
    Record<
      string,
      { sets: number; reps: number; weight: number; category: string }
    >
  >({});
  const fadeAnim = new Animated.Value(0);
  interface NavbarProps {
    setModalVisible: (visible: boolean) => void;
  }
  const categories = Object.keys(workoutsByCategory);
  const { width, height } = Dimensions.get("window");


  
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserId();
      setUserData(data || null);
    };
    fetchUserData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    const fetchPreviousWorkouts = async () => {
      if (userData) {
        const workouts = await getWorkouts(userData);
        if (workouts) {
          const workoutArray: WorkoutLog[] = Object.values(
            workouts as WorkoutLog[]
          );
          workoutArray.sort((a, b) => b.createdAt - a.createdAt);
          setPreviousWorkouts(workoutArray);
        } else {
          setPreviousWorkouts([]);
        }
      }
    };
    fetchPreviousWorkouts();
  }, [userData]);

  const handleSelectCategory = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSelectWorkout = (workout: string) => {
    Haptics.selectionAsync();
    setSelectedWorkouts((prev) => {
      if (prev[workout]) {
        const updated = { ...prev };
        delete updated[workout];
        return updated;
      } else {
        return {
          ...prev,
          [workout]: {
            sets: 0,
            reps: 0,
            weight: 0,
            category: selectedCategory || "",
          },
        };
      }
    });
  };

  const handleSaveWorkout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (userData && Object.keys(selectedWorkouts).length > 0) {
      const workoutLog: WorkoutLog = {
        caption: workoutName,
        commentsCount: 0,
        createdAt: Date.now(),
        image: "",
        likesCount: 0,
        exercises: Object.keys(selectedWorkouts).map((workout) => ({
          name: workout,
          sets: selectedWorkouts[workout].sets,
          reps: selectedWorkouts[workout].reps,
          weight: selectedWorkouts[workout].weight,
          category: selectedWorkouts[workout].category,
        })), // Store exercises with sets/reps
        userId: userData,
      };
      await createPost(workoutLog);
      const updatedWorkouts = await getWorkouts(userData);
      if (updatedWorkouts) {
        const workoutArray: WorkoutLog[] = Object.values(
          updatedWorkouts as unknown as Record<string, WorkoutLog>
        );
        workoutArray.sort((a, b) => b.createdAt - a.createdAt);
        setPreviousWorkouts(workoutArray);
      }
      setSelectedCategory(null);
      setSelectedWorkouts({});
      setWorkoutName("");
      setModalVisible(false);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const renderWorkoutItem = ({ item }: { item: WorkoutLog }) => {
    // Parse exercises, sets, and reps
    const exercises = item.exercises; // Assuming workoutName is comma-separated
    return (
      <BlurView intensity={80} tint="dark" style={styles.workoutLog}>
        <Text style={styles.workoutLogDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.workoutLogTitle}>Exercises:</Text>
        {exercises?.map((exercise, index) => (
          <View
            key={`${exercise.name}-${index}`}
            style={styles.exerciseDetails}
          >
            <Text style={styles.exerciseName}>
              {exercise.name} - {exercise.category}
            </Text>
            <Text style={styles.exerciseInfo}>
              Sets: {exercise.sets} | Reps: {exercise.reps} | Weight:{" "}
              {exercise.weight}
            </Text>
          </View>
        ))}
      </BlurView>
    );
  };

  return (
    <LinearGradient
    colors={["#4c669f", "#3b5998", "#192f6a"]}
    style={styles.container}
  >
    <View>


      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <SafeAreaProvider>
          <SafeAreaView
            style={styles.modalContainer}
            edges={["top", "left", "right", "bottom"]}
          >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalTitle}>Select Muscle Groups</Text>
              {categories.map((category) => (
                <View key={category}>
                  <TouchableOpacity
                    onPress={() => handleSelectCategory(category)}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.selectedCategoryButton,
                    ]}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                  {selectedCategory === category && (
                    <View style={styles.workoutList}>
                      {workoutsByCategory[category].map((workout) => (
                        <View key={workout}>
                          <TouchableOpacity
                            onPress={() => handleSelectWorkout(workout)}
                            style={[
                              styles.workoutButton,
                              selectedWorkouts[workout] &&
                                styles.selectedWorkoutButton,
                            ]}
                          >
                            <Text style={styles.workoutText}>{workout}</Text>
                          </TouchableOpacity>
                          {selectedWorkouts[workout] && (
                            <View style={styles.setsRepsContainer}>
                              <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Sets:</Text>
                                <TextInput
                                  style={styles.setsRepsInput}
                                  placeholder="Sets"
                                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                  keyboardType="numeric"
                                  value={selectedWorkouts[
                                    workout
                                  ].sets.toString()}
                                  onChangeText={(text) =>
                                    setSelectedWorkouts((prev) => ({
                                      ...prev,
                                      [workout]: {
                                        ...prev[workout],
                                        sets: parseInt(text) || 0,
                                      },
                                    }))
                                  }
                                />
                              </View>
                              <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Reps:</Text>
                                <TextInput
                                  style={styles.setsRepsInput}
                                  placeholder="Reps"
                                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                  keyboardType="numeric"
                                  value={selectedWorkouts[
                                    workout
                                  ].reps.toString()}
                                  onChangeText={(text) =>
                                    setSelectedWorkouts((prev) => ({
                                      ...prev,
                                      [workout]: {
                                        ...prev[workout],
                                        reps: parseInt(text) || 0,
                                      },
                                    }))
                                  }
                                />
                              </View>
                              <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Weight:</Text>
                                <TextInput
                                  style={styles.setsRepsInput}
                                  placeholder="Weight"
                                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                  keyboardType="numeric"
                                  value={selectedWorkouts[
                                    workout
                                  ].weight.toString()}
                                  onChangeText={(text) =>
                                    setSelectedWorkouts((prev) => ({
                                      ...prev,
                                      [workout]: {
                                        ...prev[workout],
                                        weight: parseInt(text) || 0,
                                      },
                                    }))
                                  }
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={handleSaveWorkout}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                closeModal();
              }}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
      {/* Display Previous Workouts */}
      <Text style={styles.title}>Previous Workouts</Text>
      {previousWorkouts.length > 0 ? (
        <FlatList
          data={previousWorkouts}
          renderItem={renderWorkoutItem} // Use the render function
          keyExtractor={(item) => item.createdAt.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noWorkoutsText}>No previous workouts found.</Text>
      )}
            <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          openModal();
        }}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonText}>Add Workout</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
}


// Updated styles for React Native components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b5998", // blue 
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 24,
  },
  modalButton: {
    backgroundColor: "white", 
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginVertical: 25,
  },
  modalButtonText: {
    color: "#3b5998", // blue 
    fontSize: getResponsiveFontSize(25),
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent black
    justifyContent: "center",
    paddingHorizontal: 20,
    
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(22),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#3b5998", // blue 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#3b5998", // blue 
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    textAlign: "center",
  },
  workoutButton: {
    backgroundColor: "#D3D3D3", // Medium grey
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  workoutList: {
    marginTop: 10,
  },
  selectedWorkoutButton: {
    backgroundColor: "white", // white
  },
  workoutText: {
    color: "3b5998", //blue 
    fontSize: getResponsiveFontSize(14),
  },
  setsRepsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    marginTop: 10,
    width: "100%",
  },
  inputGroup: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(12),
    marginBottom: 4,
  },
  setsRepsInput: {
    backgroundColor: "#333", // Input background
    color: "#FFFFFF", // White text
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
    fontSize: getResponsiveFontSize(14),
  },
  saveButton: {
    backgroundColor: "white", 
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 20,
    alignSelf: "center",
    width: "80%",
  },
  saveButtonText: {
    color: "3b5998", //blue 
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    textAlign: "center",
  },
  closeModalButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  closeModalText: {
    color: "white", 
    fontSize: 16,
  },
  title: {
    fontSize: getResponsiveFontSize(35),
    fontWeight: "bold",
    color: "white", // Turquoise
    textAlign: "center",
    marginVertical: 20,
    overflow: "hidden",
  },
  workoutLog: {
    backgroundColor: "#2F44F", 
    overflow: 'hidden',
    borderRadius: 25,
    padding: 12,
    marginBottom: 10,
  },
  workoutLogTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  workoutLogDate: {
    fontSize: getResponsiveFontSize(14),
    color: "#D3D3D3", // Light Grey
    marginBottom: 4,
  },
  noWorkoutsText: {
    fontSize: getResponsiveFontSize(16),
    color: "blue", // Tomato red
    textAlign: "center",
    marginTop: 20,
  },
  exerciseDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#3B3B3B", // Dark grey
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  exerciseInfo: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingVertical: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  previousWorkoutButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 20, // Rounded edges

  },
  previousWorkoutButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(14),
  },
  addWorkoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addWorkoutButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
  },
});
function getResponsiveFontSize(size: number) {
  const { width } = Dimensions.get("window");
  const scale = width / 375; // 375 is a base width for scaling
  const newSize = size * scale;
  return Math.round(newSize);
}


