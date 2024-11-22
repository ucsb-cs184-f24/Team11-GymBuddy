import {
  createPost,
  getWorkouts,
  WorkoutLog,
} from "@/serviceFiles/postsDatabaseService";
import { getUserId } from "@/serviceFiles/usersDatabaseService";
import { workoutsByCategory } from "@/utils/Workout/workoutCatagory";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
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
} from 'react-native';

const { width } = Dimensions.get("window");

export default function WorkoutScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);
  const [previousWorkouts, setPreviousWorkouts] = useState<WorkoutLog[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState<Record<string, { sets: number; reps: number, weight: number, category: string }>>({});
  const fadeAnim = new Animated.Value(0);

  const categories = ['Chest', 'Back', 'Biceps', 'Triceps', 'Legs', 'Shoulders', 'Abs'];

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
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSelectWorkout = (workout: string) => {
    setSelectedWorkouts((prev) => {
      if (prev[workout]) {
        const updated = { ...prev };
        delete updated[workout];
        return updated;
      } else {
        return { ...prev, [workout]: { sets: 0, reps: 0, weight: 0, category: selectedCategory || '' } };
      }
    });
  };

  const handleSaveWorkout = async () => {
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
      setWorkoutName('');
      setModalVisible(false);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const renderWorkoutItem = ({ item }: { item: WorkoutLog }) => {
    // Parse exercises, sets, and reps
    const exercises = item.exercises // Assuming workoutName is comma-separated
    return (
      <BlurView intensity={80} tint="dark" style={styles.workoutLog}>
        <Text style={styles.workoutLogDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.workoutLogTitle}>Exercises:</Text>
        {exercises.map((exercise, index) => (
          <View key={`${exercise.name}-${index}`} style={styles.exerciseDetails}>
            <Text style={styles.exerciseName}>{exercise.name} - {exercise.category}</Text>
            <Text style={styles.exerciseInfo}>
              Sets: {exercise.sets} | Reps: {exercise.reps} | Weight: {exercise.weight}
            </Text>
          </View>
        ))}
      </BlurView>
    );
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Add Workout</Text>
      </TouchableOpacity>

      <Modal 
      visible={modalVisible}
       animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>Select Muscle Groups</Text>
            {categories.map((category) => (
              <View key={category}>
                <TouchableOpacity
                  onPress={() => handleSelectCategory(category)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton,
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
                            selectedWorkouts[workout] && styles.selectedWorkoutButton,
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
                              value={selectedWorkouts[workout].sets.toString()}
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
                              value={selectedWorkouts[workout].reps.toString()}
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
                              value={selectedWorkouts[workout].weight.toString()}
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
          <TouchableOpacity onPress={handleSaveWorkout} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Workout</Text>
           </TouchableOpacity>
          <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </View>
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
    </View>
  );
}

// Updated styles for React Native components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark background
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 24,
  },
  modalButton: {
    backgroundColor: '#3B5998', // Blue button
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 20,
  },
  modalButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#2A2A2A', // Dark grey
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#FF4500', // Highlighted orange
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  workoutButton: {
    backgroundColor: '#444', // Medium grey
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  workoutList: {
    marginTop: 10,
  },
  selectedWorkoutButton: {
    backgroundColor: '#FF8C00', // Highlighted orange
  },
  workoutText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  setsRepsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 4,
  },
  setsRepsInput: {
    backgroundColor: '#333', // Input background
    color: '#FFFFFF', // White text
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#32CD32', // Green
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 20,
    alignSelf: 'center',
    width: '80%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeModalButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  closeModalText: {
    color: '#FF6347', // Tomato red
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00CED1', // Turquoise
    textAlign: 'center',
    marginVertical: 20,
  },
  workoutLog: {
    backgroundColor: '#2F4F4F', // Dark Slate Grey
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  workoutLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutLogDate: {
    fontSize: 14,
    color: '#D3D3D3', // Light Grey
    marginBottom: 4,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: '#FF6347', // Tomato red
    textAlign: 'center',
    marginTop: 20,
  },
  exerciseDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3B3B3B', // Dark grey
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseInfo: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previousWorkoutButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  previousWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  addWorkoutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addWorkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
