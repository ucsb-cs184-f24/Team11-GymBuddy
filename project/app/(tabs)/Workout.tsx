import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  Dimensions,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { getUserId, createPost, getWorkouts, WorkoutLog } from '@/serviceFiles/databaseService';
import { workoutsByCategory } from '@/utils/Workout/workoutCatagory';

const { width } = Dimensions.get('window');

export default function WorkoutScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);
  const [previousWorkouts, setPreviousWorkouts] = useState<WorkoutLog[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState<Record<string, { sets: number; reps: number }>>({});
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
          const workoutArray: WorkoutLog[] = Object.values(workouts as WorkoutLog[]);
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
        return { ...prev, [workout]: { sets: 0, reps: 0 } };
      }
    });
  };

  const handleSaveWorkout = async () => {
    if (userData && Object.keys(selectedWorkouts).length > 0) {
      const workoutLog: WorkoutLog = {
        caption: workoutName,
        commentsCount: 0,
        createdAt: Date.now(),
        image: '',
        likesCount: 0,
        muscleGroup: selectedCategory || '',
        repsCount: Object.values(selectedWorkouts).reduce((sum, w) => sum + w.reps, 0),
        setsCount: Object.values(selectedWorkouts).reduce((sum, w) => sum + w.sets, 0),
        userId: userData,
        weight: 0,
        workoutName: Object.keys(selectedWorkouts).join(', '),
        workoutType: '',
      };
      await createPost(workoutLog);
      const updatedWorkouts = await getWorkouts(userData);
      if (updatedWorkouts) {
        const workoutArray: WorkoutLog[] = Object.values(updatedWorkouts as unknown as Record<string, WorkoutLog>);
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
    const exercises = item.workoutName.split(', '); // Assuming workoutName is comma-separated
    const setsAndReps = Object.values(selectedWorkouts); // Assuming selectedWorkouts contains sets and reps info
  
    return (
      <BlurView intensity={80} tint="dark" style={styles.workoutLog}>
        <Text style={styles.workoutLogDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.workoutLogCategory}>
          Muscle Group: {item.muscleGroup}
        </Text>
        <Text style={styles.workoutLogTitle}>Exercises:</Text>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseDetails}>
            <Text style={styles.exerciseName}>{exercise.trim()}</Text>
            <Text style={styles.exerciseInfo}>
              Sets: {setsAndReps[index]?.sets || 0} | Reps: {setsAndReps[index]?.reps || 0}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutLog: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  workoutLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  workoutLogDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutLogCategory: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
  workoutLogExercises: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  noWorkoutsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#3b5998',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000', // Opaque background to hide underlying screen
    padding: 20,
    justifyContent: 'center',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  workoutList: {
    marginLeft: 20,
    marginBottom: 16,
  },
  workoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  selectedWorkoutButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
  },
  workoutText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 25,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745', // Vibrant green color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  setsRepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  setsRepsInput: {
    width: '45%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollViewContent: { paddingBottom: 20 },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#3b5998',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 10,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 2,
  },
  exerciseInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    textAlign: 'right',
  },
  
});